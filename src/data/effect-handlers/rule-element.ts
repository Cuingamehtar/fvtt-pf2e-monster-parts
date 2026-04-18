import { RefinedItem } from "../../refined-item";
import { BaseMaterialEffect } from "../material";
import { ItemCastSource, RuleElementEffectSource } from "../data-types";
import { dcByLevel, getSettingSafe } from "@src/utils";

export type RuleElementEffect = BaseMaterialEffect & {
    type: "RuleElement";
    rule: RuleElementEffectSource["rule"];
};

function isItemCastRE(
    rule: RuleElementEffectSource["rule"],
): rule is ItemCastSource {
    return rule.key == "ItemCast";
}

export class RuleElementEffectHandler {
    static async handleUpdate({
        item,
        effect,
        changes,
        materialLevel,
    }: {
        item: RefinedItem;
        effect: RuleElementEffect;
        changes: Record<string, unknown>;
        materialLevel: number;
    }) {
        const property = foundry.utils.getProperty(changes, "system.==rules");
        let rule = effect.rule;
        if (isItemCastRE(rule)) {
            if (!getSettingSafe("pf2e-toolbelt", "actionable.cast")) {
                return;
            }
            const newRule = { ...(await prepareSpellRE(rule)) };
            newRule.dc ??= dcByLevel(materialLevel);
            const oldRule = item.item.system.rules.find(
                (r) => isItemCastRE(r) && r.uuid == newRule.uuid,
            );
            if (oldRule) newRule.data.value = oldRule.data.value;
            rule = newRule;
        }
        if (Array.isArray(property)) {
            property.push(rule);
        } else {
            foundry.utils.mergeObject(
                changes,
                { ["system.==rules"]: [rule] },
                { inplace: true },
            );
        }
    }
}

async function prepareSpellRE(rule: ItemCastSource) {
    const spell = await foundry.utils.fromUuid(rule.uuid);
    if (!spell) return rule;
    return (
        game.toolbelt?.api.actionable.generateItemCastRuleSource?.(
            spell,
            rule,
        ) ?? rule
    );
}
