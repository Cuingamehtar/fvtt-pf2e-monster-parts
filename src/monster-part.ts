import { NPCPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { i18nFormat, t } from "./utils";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { Material } from "./material";

export class MonsterPart {
    item: PhysicalItemPF2e;

    constructor(item: PhysicalItemPF2e) {
        if (!item.getFlag(MODULE_ID, "monster-part")) {
            ui.notifications.error(t("monster-part.error-not-monster-part"));
            throw new Error(t("monster-part.error-not-monster-part") as string);
        }
        this.item = item;
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

    static async fromCreature(actor: NPCPF2e) {
        const config = getConfig();

        const bulk =
            config.materialBulk[actor?.system.traits.size.value ?? "med"];
        const materialValue =
            config.valueForMonsterLevel[
                (actor?.system.details.level.value ?? -1) + 1
            ];
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
                ...i.getRollOptions(),
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
        const flags = {
            value: materialValue,
            materials: materials.map((m) => m.key),
        };

        const item = {
            name: name as string,
            img: config.materialItem.image,
            system: {
                bulk: { value: bulk },
            },
            type: "equipment",
            flags: { [MODULE_ID]: { ["monster-part"]: flags } },
        };
        if (game.settings.get(MODULE_ID, "actor-lootable")) {
            await actor.setFlag("pf2e", "lootable", true);
        }

        const [part] = await actor.createEmbeddedDocuments("Item", [item]);
        return new MonsterPart(part as unknown as PhysicalItemPF2e);
    }

    async descriptionHeader() {
        const config = getConfig();
        const flags = this.item.getFlag(MODULE_ID, "monster-part")!;
        const value = flags.value;
        const materials = flags.materials.map((k) => config.materials.get(k));
        const refinements = materials
            .filter((m) => m?.type === "refinement")
            .map((m) => i18nFormat(m.label))
            .sort((a, b) => a.localeCompare(b));
        const imbues = materials
            .filter((m) => m?.type === "imbue")
            .map((m) => i18nFormat(m.label))
            .sort((a, b) => a.localeCompare(b));

        const templatePath =
            "modules/pf2e-monster-parts/templates/monster-part-header.hbs";
        return await foundry.applications.handlebars
            .renderTemplate(templatePath, {
                value,
                refinements,
                imbues,
            })
            .then((t) => foundry.applications.ux.TextEditor.enrichHTML(t));
    }
}
