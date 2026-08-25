import { BaseMaterialEffect } from "../material";
import { ItemCastSource, RuleElementEffectSource } from "../data-types";
import { Utils, getSettingSafe, i18nFormat } from "@src/utils";
import { SpellPF2e } from "foundry-pf2e";
import { AttachedMaterial } from "@src/material";
import { isArray } from "remeda";
import { Selector } from "@data/helpers";

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
        effect,
        changes,
        material,
    }: {
        effect: RuleElementEffect;
        changes: Record<string, unknown>;
        material: AttachedMaterial;
    }) {
        const property = foundry.utils.getProperty(changes, "system.rules");
        let rule = effect.rule;

        if (
            "selector" in rule &&
            material.parent.item.system.traits.otherTags.includes(
                "handwraps-of-mighty-blows",
            )
        ) {
            // replace item attack/damage with unarmed attack/damage for handwraps
            const itemToUnarmed = (s: JSONValue) =>
                s == Selector.ItemAttack
                    ? Selector.UnarmedAttack
                    : s == Selector.ItemDamage
                      ? Selector.UnarmedDamage
                      : s;

            const selector = isArray(rule.selector)
                ? (rule.selector as string[]).map(itemToUnarmed)
                : itemToUnarmed(rule.selector);

            rule = {
                ...rule,
                selector,
            };
        }
        if (isItemCastRE(rule)) {
            if (!getSettingSafe("pf2e-toolbelt", "actionable.cast")) {
                return;
            }
            const newRule = await prepareSpellRE(rule);
            if (!newRule) return;
            newRule.dc ??= Utils.dcByLevel(material.effectiveLevel.value);
            newRule.rank ??= newRule.data?.spell.system.level.value;
            const oldRule = material.parent.item.system.rules.find(
                (r) => isItemCastRE(r) && r.uuid == newRule.uuid,
            );
            if (oldRule) newRule.data.value = oldRule.data.value;
            rule = newRule;
        }
        if (rule.key == "Note" && "text" in rule) {
            if (typeof rule.text !== "string") {
                rule = {
                    ...rule,
                    text: i18nFormat(rule.text, material.getRollData()),
                };
            }
        }
        if (rule.key == "SpecialResource" && "max" in rule) {
            if (typeof rule.max !== "string" && typeof rule.max !== "number") {
                rule = {
                    ...rule,
                    max: i18nFormat(rule.max, material.getRollData()),
                };
            }
            const oldRule = material.parent.item.system.rules.find(
                (r) => r.key === "SpecialResource" && r.slug == rule.slug,
            );
            if (oldRule && "value" in oldRule) {
                rule.value = Math.min(Number(oldRule.value), Number(rule.max));
            }
        }
        if (Array.isArray(property)) {
            property.push(rule);
        } else {
            foundry.utils.mergeObject(
                changes,
                { ["system.rules"]: [rule] },
                { inplace: true },
            );
        }
    }
}

async function prepareSpellRE(
    rule: ItemCastSource,
): Promise<(ItemCastSource & ItemCastData) | undefined> {
    const spell = await foundry.utils.fromUuid<SpellPF2e>(rule.uuid);
    if (!spell) return undefined;
    return (
        game.toolbelt?.api.actionable.generateItemCastRuleSource?.(
            spell,
            rule,
        ) ?? rule
    );
}

interface ItemCastData {
    data: {
        entryId: string;
        sourceId: string;
        spell: SpellPF2e["_source"];
        value?: number;
    };
}
