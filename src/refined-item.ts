import { PhysicalItemPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { Material } from "./material";
import { i18nFormat, t } from "./utils";
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

    static async fromOwnedItem(item: PhysicalItemPF2e) {
        if (!item.parent) {
            ui.notifications.error(t("refined-item.error-item-not-owned"));
            return;
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

        // @ts-expect-error
        const rollOptions = item.getRollOptions();
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
            content: `Item ${item.name} was updated to Refined Item with ${i18nFormat(refinement.label)} refinement`,
        });
        return this.constructor(item);
    }

    getFlag() {
        return this.item.getFlag(MODULE_ID, "refined-item")!;
    }

    async updateItem() {
        const effects = this.getEffects();
        const rules = [];

        let updatedData = {};
        for (const effect of effects.flatMap((e) => e?.effects ?? [])) {
            switch (effect.key) {
                case "SkillModifier":
                    rules.push({
                        key: "FlatModifier",
                        selector: effect.skill,
                        type: "item",
                        value: effect.value,
                    });
                    break;
                case "RuleElement":
                    rules.push(effect.rule);
                    break;
            }
        }
        foundry.utils.mergeObject(updatedData, { "system.rules": rules });
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
