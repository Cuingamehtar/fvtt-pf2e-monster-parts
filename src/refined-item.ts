import { ItemPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { Material, AttachedMaterial } from "./material";
import { i18nFormat, t } from "./utils";
import { dialogs } from "./app/dialogs";
import { ModuleFlags, RefinedItemFlags } from "../types/global";
import { MonsterPart } from "./monster-part";
import { EffectHandlers } from "@data/effect-handlers";
import { configureRefinedItem } from "@src/app/refined-item-editor";
import * as R from "remeda";
import { replaceKey } from "@src/compatibility";

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

    static async fromItem(item: ItemPF2e): Promise<RefinedItem | null> {
        if (
            item.collection &&
            "metadata" in item.collection &&
            item.collection.metadata &&
            item.isOfType("physical")
        ) {
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
            return new RefinedItem(item);
        }
        if (MonsterPart.hasMonsterPartData(item)) {
            ui.notifications.error(
                t("refined-item.error-item-is-monster-part"),
            );
            return null;
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
        if (!choice) return null;
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
            content: t("refined-item.create-chat-message", {
                item: item.name,
                refinement: i18nFormat(refinement.label),
            }) as string,
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
        return Material.fromKey(refinement.key, refinement.value, {
            parent: this,
        });
    }

    get imbuements() {
        const { imbues } = this.getFlag();
        return imbues
            .map((i) => Material.fromKey(i.key, i.value, { parent: this }))
            .filter(R.isTruthy);
    }

    getFlag() {
        return foundry.utils.deepClone(
            this.item.getFlag(MODULE_ID, "refined-item")!,
        );
    }

    get coinValue() {
        const value = this.imbuements.reduce(
            (acc, imb) => acc.add(imb.effectiveValue.value),
            this.refinement.effectiveValue.value,
        );
        return value.toCoins();
    }

    async updateItem(flagData?: DeepPartial<RefinedItemFlags>) {
        flagData = foundry.utils.mergeObject(this.getFlag(), flagData, {
            inplace: false,
        });
        if (flagData) {
            if (flagData.refinement?.key === "") {
                ui.notifications.error(
                    "Attempted to set empty refinement key - reverting",
                );
                flagData.refinement.key = this.getFlag().refinement.key;
            }
            if (flagData.imbues?.some((imb) => imb.key === "")) {
                ui.notifications.error(
                    "Attempted to set empty imbuement key - reverting",
                );
                flagData.imbues = this.getFlag().imbues;
            }
            await this.item.setFlag(MODULE_ID, "refined-item", flagData);
        }

        const values = {} as Record<string, unknown>;

        for (const m of [this.refinement, ...this.imbuements]) {
            values[Material.getFlagDataName(m.key as string, "level")] =
                m.getLevel();
        }

        const updatedData = {
            flags: {
                "pf2e-monster-parts": { ...replaceKey("values", values) },
            },
        };

        await this.item.update(updatedData);

        const effects = this.getEffects();

        const changes = { system: { rules: [] } };
        for (const { effect, material } of effects) {
            await EffectHandlers.handleUpdate({
                effect,
                changes,
                material,
            });
        }
        await this.item.update(changes);
    }

    prepareDerivedData() {
        const effects = this.getEffects();
        effects?.map((effect) =>
            EffectHandlers.handleSynthetic(this, effect.effect),
        );
    }

    getRollOptions() {
        return this.item.getRollOptions("item");
    }

    getEffects() {
        return [this.refinement, ...this.imbuements].flatMap((m) =>
            m.getEffects().map((effect) => ({
                material: m,
                effect,
            })),
        );
    }

    async descriptionHeader() {
        const prepare = (m: AttachedMaterial) => {
            const flavor = m.getFlavor();
            const level = m.effectiveLevel;
            const value = m.effectiveValue.value.toCoins();

            return {
                key: m.data.key,
                label: flavor.label,
                value,
                level: level,
                flavor: flavor.flavor,
                notes: flavor.parts,
            };
        };

        const refinement = prepare(this.refinement);

        const imbues = this.imbuements.map((m) => prepare(m));

        const templatePath =
            "modules/pf2e-monster-parts/templates/refined-item-header.hbs";
        return await foundry.applications.handlebars
            .renderTemplate(templatePath, {
                refinement,
                imbues,
            })
            .then((t) =>
                foundry.applications.ux.TextEditor.enrichHTML(t, {
                    rollData: this.item.getRollData(),
                }),
            );
    }

    configure() {
        return configureRefinedItem(this);
    }
}
