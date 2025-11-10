import { EquipmentPF2e, NPCPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { i18nFormat, simplifyCoins, t } from "./utils";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { Material } from "./material";
import { ModuleFlags } from "./types";

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

    getValue(count?: number) {
        count = count ?? this.quantity;
        const baseValue = this.getFlag().value;
        return baseValue * count;
    }

    get coinValue() {
        const value = this.getFlag().value;
        return simplifyCoins(value);
    }

    static valueOfCreature(actor: NPCPF2e) {
        const config = getConfig();

        return config.valueForMonsterLevel[
            (actor?.system.details.level.value ?? -1) + 1
        ];
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
            value: materialValue,
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
            await actor.setFlag("pf2e", "lootable", true);
        }

        const [part] = (await actor.createEmbeddedDocuments("Item", [
            item,
        ])) as unknown as HasMonsterPartData<EquipmentPF2e>[];
        return new MonsterPart(part);
    }

    async descriptionHeader() {
        const config = getConfig();
        const flags = this.item.getFlag(MODULE_ID, "monster-part")!;
        const value = flags.value;
        const materials = [
            ...config.materials
                .values()
                .filter((m) => flags.materials.includes(m.key)),
        ];
        const refinements = materials
            .filter((m) => m?.type === "refinement")
            .map((m) => i18nFormat(m.label))
            .sort((a, b) => a.localeCompare(b));
        const imbues = materials
            .filter((m) => m?.type === "imbuement")
            .map((m) => ({ key: m.key, label: i18nFormat(m.label) }))
            .sort((a, b) => a.label.localeCompare(b.label));

        const templatePath =
            "modules/pf2e-monster-parts/templates/monster-part-header.hbs";
        return await foundry.applications.handlebars
            .renderTemplate(templatePath, {
                coins: simplifyCoins(value),
                refinements,
                imbues,
                image: flags.imageSrc,
            })
            .then((t) => foundry.applications.ux.TextEditor.enrichHTML(t));
    }
}
