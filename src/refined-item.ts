import { ItemPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { Material } from "./material";
import { i18nFormat, simplifyCoins, t } from "./utils";
import { dialogs } from "./app/dialogs";
import { ModuleFlags, RefinedItemFlags } from "../types/global";
import { AutomaticRefinementProgression } from "./automatic-refinement-progression";
import { MonsterPart } from "./monster-part";
import { EffectHandlers } from "@data/effect-handlers";

type HasRefinedData<T extends PhysicalItemPF2e> = T & {
    flags: {
        ["pf2e-monster-parts"]: {
            ["refined-item"]: NonNullable<ModuleFlags["refined-item"]>;
        };
    };
};

export class RefinedItem {
    item: HasRefinedData<PhysicalItemPF2e>;

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
        if (RefinedItem.hasRefinedItemData(item)) {
            ui.notifications.warn(
                t("refined-item.warn-item-already-refined", {
                    item: item.name,
                }),
            );
            return this.constructor(item);
        }
        if (MonsterPart.hasMonsterPartData(item)) {
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

    get refinement() {
        const { refinement } = this.getFlag();
        return Material.fromKey(refinement.key, refinement.value);
    }
    get imbuements() {
        const { imbues } = this.getFlag();
        return imbues.map((i) => Material.fromKey(i.key, i.value));
    }

    getFlag() {
        return this.item.getFlag(MODULE_ID, "refined-item")!;
    }

    get coinValue() {
        const flag = this.getFlag();
        const value = flag.imbues.reduce(
            (acc, imb) => acc + imb.value,
            flag.refinement.value,
        );
        return simplifyCoins(value);
    }

    async updateItem(flagData?: RefinedItemFlags) {
        if (flagData)
            await this.item.setFlag(MODULE_ID, "refined-item", flagData);
        if (AutomaticRefinementProgression.isEnabled) {
            await AutomaticRefinementProgression.adjustRefinementValue(this);
        }

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

        const effects = this.getEffects();

        const changes = { system: { ["==rules"]: [] } };
        effects.forEach((effect) =>
            EffectHandlers.handleUpdate(this, effect, changes),
        );
        await this.item.update(changes);
    }

    prepareDerivedData() {
        const effects = this.getEffects();
        effects?.map((effect) => EffectHandlers.handleSynthetic(this, effect));
    }

    getRollOptions() {
        return this.item.getRollOptions("item");
    }

    getEffects() {
        return [this.refinement, ...this.imbuements]
            .filter((m): m is Material => !!m)
            .flatMap((m: Material) => m.getEffects(this));
    }

    async descriptionHeader() {
        const prepare = (m?: Material) => {
            if (!m) return undefined;
            const flavor = m.getFlavor(this);
            const level = m.getLevel(this);

            return {
                key: m.data.key,
                label: flavor.label,
                value: m.coinValue,
                level: level,
                flavor: flavor.flavor,
                notes: flavor.parts,
            };
        };

        const refinement = prepare(this.refinement);

        const imbues = this.imbuements
            .filter((m): m is Material => !!m)
            .map((m) => prepare(m));

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
