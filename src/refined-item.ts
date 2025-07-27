import { ItemPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import {
    getExtendedItemRollOptions,
    setPotency,
    setResilient,
    setStriking,
} from "./itemUtil";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { getMaterialLevel, RefinedItemFlags } from "./flags";
import { Material } from "./material";
import { i18nFormat, t } from "./utils";
import { dialogs } from "./app/dialogs";

export class RefinedItem {
    static async fromItem(item: PhysicalItemPF2e) {
        if (item.getFlag(MODULE_ID, "refined-item")) {
            ui.notifications.error(
                t("Dialog.CreateRefinedItem.ErrorItemAlreadyRefined"),
            );
            return;
        }
        if (item.getFlag(MODULE_ID, "monster-part")) {
            ui.notifications.error(
                t("Dialog.CreateRefinedItem.ErrorItemIsMonsterPart"),
            );
            return;
        }
        if (!["weapon", "armor", "equipment"].includes(item.type)) {
            ui.notifications.error("Item is not a valid item");
            return;
        }
        const config = getConfig();

        const rollOptions = getExtendedItemRollOptions(item as ItemPF2e);
        const applicableRefinements = [
            ...config.materials
                .values()
                .filter((m) => m.type === "refinement")
                .filter((m) => new Material(m).testItem({ rollOptions }))
                .map((m) => ({ key: m.key, label: i18nFormat(m.label) })),
        ];
        if (!applicableRefinements) {
            ui.notifications.error(`No applicable refinements`);
            return null;
        }
        const choice = await dialogs.choice(applicableRefinements);
        if (!choice) return;
        const flags: RefinedItemFlags = {
            refinement: {
                key: choice.selected,
                value: -item.system.price.value.goldValue,
            },
            imbues: [],
        };
        await item.setFlag(MODULE_ID, "refined-item", flags);
        const refinement = config.materials.get(flags.refinement.key)!;
        ChatMessage.create({
            content: `Item ${item.name} was updated to Refined Item with ${i18nFormat(refinement.label)} refinement`,
        });
        return item;
    }

    static async prepareItem(item: ItemPF2e) {
        const effects = getEffects(item);
        const rules = [];

        let updatedData = {};
        for (const effect of effects.flatMap((e) => e?.effects ?? [])) {
            switch (effect.key) {
                case "ItemPotency":
                    foundry.utils.mergeObject(
                        updatedData,
                        setPotency(effect.value),
                        {
                            inplace: true,
                        },
                    );
                    break;
                case "WeaponStriking":
                    foundry.utils.mergeObject(
                        updatedData,
                        setStriking(effect.value),
                        {
                            inplace: true,
                        },
                    );
                    break;
                case "ArmorResilient":
                    foundry.utils.mergeObject(
                        updatedData,
                        setResilient(effect.value),
                        {
                            inplace: true,
                        },
                    );
                    break;
                case "ShieldImprovement":
                    let hardness = effect.hardness;
                    let hp = effect.hp;
                    const isBuckler =
                        (item as PhysicalItemPF2e).system.baseItem ===
                        "buckler";
                    if (isBuckler) {
                        hardness -= 2;
                        hp -= 12;
                    }
                    rules.push(
                        {
                            key: "ItemAlteration",
                            property: "hp-max",
                            mode: "upgrade",
                            value: hp,
                            itemId: "{item|id}",
                        },
                        {
                            key: "ItemAlteration",
                            property: "hardness",
                            mode: "upgrade",
                            value: hardness,
                            itemId: "{item|id}",
                        },
                    );
                    break;
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
        return item.update(updatedData);
    }
}

Hooks.on("renderItemSheetPF2e", (sheet, htmlArray, _) => {
    const html = htmlArray[0] as HTMLDivElement;
    const div = html.querySelector("div.monster-parts-header");
    if (!div) return;
    const item = sheet.item as ItemPF2e;
    const flags = item.getFlag(MODULE_ID, "refined-item");
    if (!flags) return;
    const config = getConfig();
    const refinement = flags.refinement;
    const material = config.materials.get(refinement.key)!;
    div.innerHTML = `<p>${i18nFormat(material.label)} <strong>${getMaterialLevel(refinement, item)} (${Math.floor(refinement.value)} gp)</strong></p>`;
});

export function getEffects(item: ItemPF2e) {
    const config = getConfig();
    const flags = item.getFlag(MODULE_ID, "refined-item");
    if (!flags) return [];
    return [flags.refinement, ...flags.imbues]
        .filter((m) => config.materials.has(m.key))
        .map((m) => {
            const material = config.materials.get(m.key)!;
            const level = getMaterialLevel(m, item);
            return {
                label: material.label,
                level,
                value: m.value,
                effects: material.effects
                    .filter(
                        (e) =>
                            e.levels.from <= level &&
                            (!e.levels.to || level <= e.levels.to),
                    )
                    .flatMap((e) => e.effects),
            };
        });
}
