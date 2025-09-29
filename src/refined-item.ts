import { ItemPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { Material } from "./material";
import { i18nFormat, t } from "./utils";
import { dialogs } from "./app/dialogs";
import { ModuleFlags } from "./types";
import { AutomaticRefinementProgression } from "./automatic-refinement-progression";

type HasRefinedData<T extends PhysicalItemPF2e> = T & {
    flags: {
        ["pf2e-monster-parts"]: {
            ["refined-item"]: NonNullable<ModuleFlags["refined-item"]>;
        };
    };
};

export class RefinedItem {
    item: PhysicalItemPF2e;

    constructor(item: HasRefinedData<PhysicalItemPF2e>) {
        if (!item.getFlag(MODULE_ID, "refined-item")) {
            ui.notifications.error(t("refined-item.error-not-refined-item"));
            throw new Error(t("refined-item.error-not-refined-item") as string);
        }
        this.item = item;
    }

    static async fromItem(item: ItemPF2e) {
        // @ts-expect-error
        if (item.collection?.metadata && item.isOfType("physical")) {
            // item is in a compendium
            item = (await Item.create(item.toObject())) as PhysicalItemPF2e;
            ui.notifications.info(t("refined-item.imported-from-compendium"));
        }
        if (!item.isOfType("physical")) {
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
            ...item.getRollOptions("item"),
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
        return new RefinedItem(item as HasRefinedData<typeof item>);
    }

    static hasRefinedItemData<T extends PhysicalItemPF2e>(
        item: T,
    ): item is HasRefinedData<T> {
        return !!item.getFlag(MODULE_ID, "refined-item");
    }

    getFlag() {
        return this.item.getFlag(MODULE_ID, "refined-item")!;
    }

    async updateItem() {
        if (AutomaticRefinementProgression.isEnabled) {
            await AutomaticRefinementProgression.adjustRefinementValue(this);
        }
        const effects = this.getEffects();

        const flag = this.getFlag();
        let updatedData = {
            ["flags.pf2e-monster-parts.==values"]: {} as Record<string, any>,
        };

        for (const m of [flag.refinement, ...flag.imbues]) {
            const mat = Material.fromKey(m.key, m.value);
            if (!mat) continue;
            updatedData["flags.pf2e-monster-parts.==values"][
                Material.getFlagDataName(mat.data.key as string, "level")
            ] = mat?.getLevel(this);
        }
        await this.item.update(updatedData);

        const effectData = {};
        const rules = [];
        for (const effect of effects.flatMap((e) => e?.effects ?? [])) {
            switch (effect.type) {
                case "RuleElement":
                    rules.push(effect.rule);
                    break;
            }
        }
        foundry.utils.mergeObject(effectData, {
            "system.rules": rules,
        });
        return this.item.update(effectData);
    }

    getRollOptions() {
        const options = [
            ...this.item.getRollOptions("item"),
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
            .map((m?: Material) => {
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

        const prepare = (m?: Material) => {
            if (!m) return undefined;
            const flavor = m.getFlavor(this);

            return {
                label: flavor.label,
                value: m.value,
                level: m.getLevel(this),
                flavor: flavor.flavor,
                notes: flavor.parts,
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

export function extendDerivedData() {
    libWrapper.register(
        MODULE_ID,
        "CONFIG.PF2E.Item.documentClasses.weapon.__proto__.prototype.prepareDerivedData",
        function (
            wrapped: typeof PhysicalItemPF2e.prototype.prepareDerivedData,
        ) {
            wrapped();

            if (RefinedItem.hasRefinedItemData(this as PhysicalItemPF2e)) {
                const item = new RefinedItem(
                    this as HasRefinedData<PhysicalItemPF2e>,
                );
                const flag = item.getFlag();
                (this as PhysicalItemPF2e).system.level.value =
                    Material.fromKey(
                        flag.refinement.key,
                        flag.refinement.value,
                    )?.getLevel(item) ?? 0;

                const price = flag.imbues.reduce(
                    (acc, e) => acc + e.value,
                    flag.refinement.value,
                );
                (this as PhysicalItemPF2e).system.price.value =
                    new game.pf2e.Coins({ gp: price });
            }
        },
        "MIXED",
    );
}
