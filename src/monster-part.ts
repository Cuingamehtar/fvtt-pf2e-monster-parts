import {
    ActorPF2e,
    EquipmentPF2e,
    NPCPF2e,
    PhysicalItemPF2e,
} from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { i18nFormat, t } from "./utils";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { Material, MaterialValue } from "./material";
import { ModuleFlags } from "../types/global";
import { configureMonsterPart } from "@src/app/monster-part-editor";
import * as R from "remeda";

type HasMonsterPartData<T extends PhysicalItemPF2e> = T & {
    flags: {
        ["pf2e-monster-parts"]: {
            ["monster-part"]: NonNullable<ModuleFlags["monster-part"]>;
        };
    };
};

export class MonsterPart {
    item: HasMonsterPartData<PhysicalItemPF2e>;

    constructor(item: HasMonsterPartData<PhysicalItemPF2e>) {
        if (!item.getFlag(MODULE_ID, "monster-part")) {
            ui.notifications.error(t("monster-part.error-not-monster-part"));
            throw new Error(t("monster-part.error-not-monster-part") as string);
        }
        this.item = item;
    }

    static hasMonsterPartData<T extends PhysicalItemPF2e>(
        item: T,
    ): item is HasMonsterPartData<T> {
        return !!item.getFlag(MODULE_ID, "monster-part");
    }

    getFlag() {
        return this.item.getFlag(MODULE_ID, "monster-part")!;
    }

    get quantity() {
        return this.item.quantity;
    }

    async setQuantity(value: number) {
        return this.item.update({ "system.quantity": value });
    }

    get materials() {
        return this.getFlag().materials;
    }

    get isOwnedByActor() {
        return !!this.item.actor;
    }

    getValue(count?: number): MaterialValue {
        count = count ?? this.quantity;
        const baseValue = new MaterialValue(this.getFlag().value);
        return baseValue.mul(count);
    }

    get coinValue() {
        const value = new MaterialValue(this.getFlag().value);
        return value.toCoins();
    }

    static valueOfCreature(actor: NPCPF2e) {
        const config = getConfig();

        return new MaterialValue(
            config.valueForMonsterLevel[
                (actor?.system.details.level.value ?? -1) + 1
            ] ?? 0,
        );
    }

    static async fromCreature(actor: NPCPF2e) {
        const config = getConfig();

        const bulk =
            config.materialBulk[actor?.system.traits.size.value ?? "med"];
        const materialValue = MonsterPart.valueOfCreature(actor);
        const name = actor
            ? t("material.item.name-owned", {
                  actor: actor.name,
              })
            : t("material.item.name");

        const actorRollOptions = getExtendedNPCRollOptions(actor);
        const rollOptions = [
            actorRollOptions,
            ...actor.items.map((i) => [
                ...actorRollOptions,
                `item:type:${i.type}`,
                ...i.getRollOptions("item"),
            ]),
        ];

        const materials = [
            ...config.materials.values().filter((m) => {
                const mat = new Material(m);
                return rollOptions.some((ro) =>
                    mat.testCreature({ rollOptions: ro }),
                );
            }),
        ];
        const flags: ModuleFlags["monster-part"] = {
            value: materialValue.gp,
            materials: materials.map((m) => m.key),
            imageSrc:
                actor.img !== "systems/pf2e/icons/default-icons/npc.svg"
                    ? actor.img
                    : undefined,
        };

        const item = {
            name: name as string,
            img: config.materialItem.image,
            system: {
                bulk: { value: bulk },
                size: "med",
            },
            type: "treasure",
            flags: { [MODULE_ID]: { ["monster-part"]: flags } },
        };
        if (game.settings.get(MODULE_ID, "actor-lootable")) {
            await actor.setFlag(game.system.id, "lootable", true);
        }

        const [part] = (await actor.createEmbeddedDocuments("Item", [
            item,
        ])) as unknown as HasMonsterPartData<EquipmentPF2e>[];
        return new MonsterPart(part);
    }

    static async fromPureMaterial(actor: ActorPF2e, material: Material) {
        const config = getConfig();
        const flags: ModuleFlags["monster-part"] = {
            value: material.value.gp,
            materials: [material.key],
        };

        const item = {
            name: t("material.item.name-pure", {
                material: i18nFormat(material.label),
            }) as string,
            img: config.materialItem.image,
            system: {
                size: "med",
            },
            type: "treasure",
            flags: { [MODULE_ID]: { ["monster-part"]: flags } },
        };
        const [part] = (await actor.createEmbeddedDocuments("Item", [
            item,
        ])) as unknown as HasMonsterPartData<EquipmentPF2e>[];
        return new MonsterPart(part);
    }

    async descriptionHeader() {
        const config = getConfig();
        const flags = this.item.getFlag(MODULE_ID, "monster-part")!;
        const value = new MaterialValue(flags.value);
        const [refinements, imbues] = R.pipe(
            [...config.materials.values()],
            R.filter((m) => flags.materials.includes(m.key)),
            R.map((m) => ({
                type: m.type,
                key: m.key,
                label: i18nFormat(m.label),
            })),
            R.sort((a, b) => a.label.localeCompare(b.label)),
            R.partition((m) => m.type === "refinement"),
        );

        const templatePath =
            "modules/pf2e-monster-parts/templates/monster-part-header.hbs";
        return await foundry.applications.handlebars
            .renderTemplate(templatePath, {
                coins: value.toCoins(),
                refinements,
                imbues,
                image: flags.imageSrc,
            })
            .then((t) => foundry.applications.ux.TextEditor.enrichHTML(t));
    }

    configure() {
        return configureMonsterPart(this);
    }
}
