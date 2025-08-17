import { PhysicalItemPF2e, ItemPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { Material } from "./material";
import { i18nFormat, isPhysicalItem, t } from "./utils";
import { dialogs } from "./app/dialogs";
import { ImbueSource, RefinementSource } from "./data/data-types";

export class RefinedItem {
    item: PhysicalItemPF2e;

    constructor(item: PhysicalItemPF2e) {
        if (!item.getFlag(MODULE_ID, "refined-item")) {
            ui.notifications.error(t("refined-item.error-not-refined-item"));
            throw new Error(t("refined-item.error-not-refined-item") as string);
        }
        this.item = item;
    }

    static async fromItem(item: ItemPF2e) {
        // @ts-expect-error
        if (item.collection?.metadata && isPhysicalItem(item)) {
            // item is in a compendium
            item = (await Item.create(item.toObject())) as PhysicalItemPF2e;
            ui.notifications.info(t("refined-item.imported-from-compendium"));
        }
        if (!isPhysicalItem(item)) {
            ui.notifications.error(
                t("refined-item.error-not-physical-item", { item: item.name }),
            );
            return null;
        }
        if (item.getFlag(MODULE_ID, "refined-item")) {
            ui.notifications.warn(
                t("refined-item.warn-item-already-refined", {
                    item: item.name,
                }),
            );
            return this.constructor(item);
        }
        if (item.getFlag(MODULE_ID, "monster-part")) {
            ui.notifications.error(
                t("refined-item.error-item-is-monster-part"),
            );
            return;
        }
        const config = getConfig();

        const rollOptions = [
            `item:type:${item.type}`,
            // @ts-expect-error
            ...item.getRollOptions(),
        ];
        const applicableRefinements = [
            ...config.materials
                .values()
                .filter((m) => m.type === "refinement")
                .filter((m) => new Material(m).testItem({ rollOptions }))
                .map((m) => ({ key: m.key, label: i18nFormat(m.label) })),
        ];
        if (applicableRefinements.length == 0) {
            ui.notifications.error(
                t("refined-item.error-no-applicable-refinements"),
            );
            return null;
        }
        const choice = await dialogs.choice(applicableRefinements);
        if (!choice) return;
        const flags = {
            refinement: {
                key: choice.selected,
                value: -item.system.price.value.goldValue,
            },
            imbues: [],
        };
        await item.setFlag(MODULE_ID, "refined-item", flags);
        const refinement = config.materials.get(flags.refinement.key)!;
        await ChatMessage.create({
            content: `<p>Item <strong>${item.name}</strong> was updated to Refined Item with <strong>${i18nFormat(refinement.label)}</strong> refinement.</p>`,
        });
        return new RefinedItem(item);
    }

    getFlag() {
        return this.item.getFlag(MODULE_ID, "refined-item")!;
    }

    async updateItem() {
        const effects = this.getEffects();
        const rules = [];

        const flag = this.getFlag();
        const level =
            Material.fromKey(
                flag.refinement.key,
                flag.refinement.value,
            )?.getLevel(this) ?? 0;

        let updatedData = {};
        for (const effect of effects.flatMap((e) => e?.effects ?? [])) {
            switch (effect.key) {
                case "RuleElement":
                    rules.push(effect.rule);
                    break;
            }
        }
        foundry.utils.mergeObject(updatedData, {
            "system.rules": rules,
            "system.level.value": level,
        });
        return this.item.update(updatedData);
    }

    getRollOptions() {
        const options = [
            // @ts-expect-error
            ...this.item.getRollOptions(),
            `item:type:${this.item.type}`,
        ];
        const flags = this.item.getFlag(MODULE_ID, "refined-item");
        if (!flags) return options;
        return [
            ...options,
            ...[flags.refinement, ...flags.imbues].map(
                (v) =>
                    `${v.key}:${Material.fromKey(v.key, v.value)?.getLevel(this) ?? 0}`,
            ),
        ];
    }

    getEffects() {
        const flags = this.item.getFlag(MODULE_ID, "refined-item");
        if (!flags) return [];
        return [flags.refinement, ...flags.imbues]
            .map((m) => Material.fromKey(m.key, m.value))
            .map((m?: Material<RefinementSource | ImbueSource>) => {
                if (!m) return undefined;
                const level = m.getLevel(this);
                const effects = m.getEffects(this);
                return {
                    key: m.data.key,
                    label: m.data.label,
                    level,
                    value: m.value,
                    effects: effects,
                };
            });
    }

    async descriptionHeader() {
        const flags = this.item.getFlag(MODULE_ID, "refined-item")!;

        const prepare = (m?: Material<RefinementSource | ImbueSource>) => {
            if (!m) return undefined;
            const flavor = m.getFlavor(this);

            return {
                label: flavor.label,
                value: m.value,
                level: m.getLevel(this),
                flavor: flavor.flavor,
                notes: flavor.effects,
            };
        };

        const refinement = prepare(
            Material.fromKey(flags.refinement.key, flags.refinement.value),
        );

        const imbues = flags.imbues.map((i) =>
            prepare(Material.fromKey(i.key, i.value)),
        );

        const templatePath =
            "modules/pf2e-monster-parts/templates/refined-item-header.hbs";
        return await foundry.applications.handlebars
            .renderTemplate(templatePath, {
                refinement,
                imbues,
            })
            .then((t) => foundry.applications.ux.TextEditor.enrichHTML(t));
    }
}
