import { MaterialData } from "../material";
import { PredicateStatement, SkillSlug } from "foundry-pf2e";
import { predicateAnySense } from "../helpers";

function skillEffects(
    skill: SkillSlug | "perception",
): MaterialData["effects"] {
    return [
        {
            levelMin: 3,
            rule: {
                key: "ItemAlteration",
                mode: "add",
                property: "traits",
                value: "invested",
                itemId: "{item|id}",
            },
            type: "RuleElement",
        },
        {
            levelMin: 3,
            rule: {
                key: "ItemAlteration",
                mode: "add",
                property: "traits",
                value: "magical",
                itemId: "{item|id}",
            },
            type: "RuleElement",
        },
        {
            levelMin: 3,
            levelMax: 8,
            rule: {
                key: "FlatModifier",
                selector: skill,
                type: "item",
                value: 1,
            },
            type: "RuleElement",
        },
        {
            levelMin: 9,
            levelMax: 16,
            rule: {
                key: "FlatModifier",
                selector: skill,
                type: "item",
                value: 2,
            },
            type: "RuleElement",
        },
        {
            levelMin: 17,
            rule: {
                key: "FlatModifier",
                selector: skill,
                type: "item",
                value: 3,
            },
            type: "RuleElement",
        },
    ];
}

export function addSkillRefinements(): MaterialData[] {
    const skills = (Object.keys(CONFIG.PF2E.skills) as SkillSlug[]).reduce(
        (acc, s) => {
            acc[s] = {
                label: CONFIG.PF2E.skills[s]!.label as I18nKey,
                predicate: [`self:skill:${s}:rank:1`],
            };
            return acc;
        },
        {
            perception: {
                label: "PF2E.Item.Class.FIELDS.perception.label",
                predicate: [predicateAnySense()],
            },
        } as unknown as Record<
            SkillSlug | "perception",
            { label: I18nKey; predicate: PredicateStatement[] }
        >,
    );
    return (Object.keys(skills) as (keyof typeof skills)[]).map((skill) => {
        const { label, predicate } = skills[skill];
        return {
            key:
                skill == "perception"
                    ? "refinement:perception"
                    : `refinement:skill:${skill}`,
            type: "refinement",
            label: { type: "key", key: label },
            itemPredicate: ["item:type:equipment"],
            monsterPredicate: predicate,
            header: {
                labels: [
                    {
                        levelMin: 3,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.skill.imbuing",
                        },
                        sort: 20,
                    },
                    {
                        levelMin: 3,
                        levelMax: 8,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.skill.item-bonus",
                            parameters: {
                                bonus: 1,
                                skill: { type: "key", key: label },
                            },
                        },
                        sort: 10,
                    },
                    {
                        levelMin: 9,
                        levelMax: 16,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.skill.item-bonus",
                            parameters: {
                                bonus: 2,
                                skill: { type: "key", key: label },
                            },
                        },
                        sort: 10,
                    },
                    {
                        levelMin: 17,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.skill.item-bonus",
                            parameters: {
                                bonus: 3,
                                skill: { type: "key", key: label },
                            },
                        },
                        sort: 10,
                    },
                ],
            },
            effects: skillEffects(skill),
        };
    });
}
