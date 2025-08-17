import { SkillSlug } from "foundry-pf2e";
import { MaterialEffectSource, RefinementSource } from "./data-types";
import {
    addItemBonus,
    levelRange,
    predicateAnySense,
    selfAlteration,
    shieldAlteration,
} from "./helpers";
import { i18nFormat, tkey } from "../utils";
import { MODULE_ID } from "../module";

export function createDefaultRefinements() {
    const skills = Object.keys(CONFIG.PF2E.skills) as SkillSlug[];

    const weaponEffects: MaterialEffectSource[] = [
        {
            ...levelRange(2, 3),
            effects: [
                selfAlteration("potency", 1),
                { key: "InlineNote", text: tkey("refinement.weapon.+1") },
            ],
        },
        {
            ...levelRange(4, 9),
            effects: [
                selfAlteration("potency", 1),
                selfAlteration("striking", 1),
                {
                    key: "InlineNote",
                    text: tkey("refinement.weapon.striking+1"),
                },
            ],
        },
        {
            ...levelRange(10, 11),
            effects: [
                selfAlteration("potency", 2),
                selfAlteration("striking", 1),
                {
                    key: "InlineNote",
                    text: tkey("refinement.weapon.striking+2"),
                },
            ],
        },
        {
            ...levelRange(12, 15),
            effects: [
                selfAlteration("potency", 2),
                selfAlteration("striking", 2),
                {
                    key: "InlineNote",
                    text: tkey("refinement.weapon.greater-striking+2"),
                },
            ],
        },
        {
            ...levelRange(16, 18),
            effects: [
                selfAlteration("potency", 3),
                selfAlteration("striking", 2),
                {
                    key: "InlineNote",
                    text: tkey("refinement.weapon.greater-striking+3"),
                },
            ],
        },
        {
            ...levelRange(19),
            effects: [
                selfAlteration("potency", 3),
                selfAlteration("striking", 3),
                {
                    key: "InlineNote",
                    text: tkey("refinement.weapon.major-striking+3"),
                },
            ],
        },
    ];

    const armorEffects: MaterialEffectSource[] = [
        {
            ...levelRange(5, 7),
            effects: [
                selfAlteration("potency", 1),
                {
                    key: "InlineNote",
                    text: tkey("refinement.armor.+1"),
                },
            ],
        },
        {
            ...levelRange(8, 10),
            effects: [
                selfAlteration("potency", 1),
                selfAlteration("resilient", 1),
                {
                    key: "InlineNote",
                    text: tkey("refinement.armor.resilient+1"),
                },
            ],
        },
        {
            ...levelRange(11, 13),
            effects: [
                selfAlteration("potency", 2),
                selfAlteration("resilient", 1),
                {
                    key: "InlineNote",
                    text: tkey("refinement.armor.resilient+2"),
                },
            ],
        },
        {
            ...levelRange(14, 17),
            effects: [
                selfAlteration("potency", 2),
                selfAlteration("resilient", 2),
                {
                    key: "InlineNote",
                    text: tkey("refinement.armor.greater-resilient+2"),
                },
            ],
        },
        {
            ...levelRange(18, 19),
            effects: [
                selfAlteration("potency", 3),
                selfAlteration("resilient", 2),
                {
                    key: "InlineNote",
                    text: tkey("refinement.armor.greater-resilient+3"),
                },
            ],
        },
        {
            ...levelRange(20),
            effects: [
                selfAlteration("potency", 3),
                selfAlteration("resilient", 3),
                {
                    key: "InlineNote",
                    text: tkey("refinement.armor.major-resilient+3"),
                },
            ],
        },
    ];

    // level from / level to / hardness / hp
    const shieldEffectValues = [
        [3, 4, 5, 30],
        [5, 6, 6, 36],
        [7, 7, 7, 42],
        [8, 8, 8, 48],
        [9, 9, 9, 54],
        [10, 11, 10, 60],
        [12, 12, 11, 66],
        [13, 14, 12, 72],
        [15, 15, 13, 78],
        [16, 16, 14, 84],
        [17, 17, 15, 90],
        [18, 18, 16, 96],
        [19, 19, 17, 102],
        [20, undefined, 18, 108],
    ];
    const shieldEffects: MaterialEffectSource[] = [
        ...shieldEffectValues.flatMap(([from, to, hardness, hp]) => ({
            ...levelRange(from as number, to),
            effects: shieldAlteration(hp as number, hardness as number),
        })),
        {
            ...levelRange(4),
            effects: [
                {
                    key: "InlineNote",
                    text: tkey("refinement.shield.imbuing"),
                },
            ],
        },
    ];

    const bucklerEffects: MaterialEffectSource[] = [
        ...shieldEffectValues.flatMap(([from, to, hardness, hp]) => ({
            ...levelRange(from as number, to),
            effects: shieldAlteration(
                (hp as number) - 2,
                (hardness as number) - 12,
            ),
        })),
        {
            ...levelRange(4),
            effects: [
                {
                    key: "InlineNote",
                    text: tkey("refinement.shield.imbuing"),
                },
            ],
        },
    ];

    function skillEffects(
        skill: SkillSlug | "perception",
        label: I18nKey | I18nString,
    ): MaterialEffectSource[] {
        return [
            {
                ...levelRange(3, 8),
                effects: [
                    addItemBonus(skill, 1),
                    {
                        key: "InlineNote",
                        text: tkey("refinement.skill.item-bonus"),
                        parameters: {
                            bonus: 1,
                            skill: i18nFormat(label) as string,
                        },
                    },
                ],
            },
            {
                ...levelRange(9, 16),
                effects: [
                    addItemBonus(skill, 2),
                    {
                        key: "InlineNote",
                        text: tkey("refinement.skill.item-bonus"),
                        parameters: {
                            bonus: 2,
                            skill: i18nFormat(label) as string,
                        },
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    addItemBonus(skill, 3),
                    {
                        key: "InlineNote",
                        text: tkey("refinement.skill.item-bonus"),
                        parameters: {
                            bonus: 3,
                            skill: i18nFormat(label) as string,
                        },
                    },
                ],
            },
            {
                ...levelRange(3),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("refinement.skill.imbuing"),
                    },
                ],
            },
        ];
    }

    function skillRefinement(skill: SkillSlug): RefinementSource {
        return {
            key: `refinement:skill:${skill}`,
            label: CONFIG.PF2E.skills[skill].label as I18nKey,
            type: "refinement",
            itemPredicate: ["item:type:equipment"],
            monsterPredicate: [`skill:${skill}:rank:1`],
            effects: skillEffects(
                skill,
                CONFIG.PF2E.skills[skill].label as I18nKey,
            ),
        };
    }

    const refines: RefinementSource[] = [
        {
            key: "refinement:weapon:bludgeoning",
            type: "refinement",
            label: tkey(`refinement.bludgeoning`),
            itemPredicate: [
                "item:type:weapon",
                "weapon:damage:type:bludgeoning",
            ],
            monsterPredicate: [
                "item:type:melee",
                "melee:damage:type:bludgeoning",
            ],
            effects: weaponEffects,
        },
        {
            key: "refinement:weapon:piercing",
            type: "refinement",
            label: tkey(`refinement.piercing`),
            itemPredicate: ["item:type:weapon", "weapon:damage:type:piercing"],
            monsterPredicate: ["item:type:melee", "melee:damage:type:piercing"],
            effects: weaponEffects,
        },
        {
            key: "refinement:weapon:slashing",
            type: "refinement",
            label: tkey(`refinement.slashing`),
            itemPredicate: ["item:type:weapon", "weapon:damage:type:slashing"],
            monsterPredicate: ["item:type:melee", "melee:damage:type:slashing"],
            effects: weaponEffects,
        },
        {
            key: "refinement:armor:unarmored",
            type: "refinement",
            label: tkey(`refinement.armor-unarmored`),
            itemPredicate: ["item:type:armor", "armor:category:unarmored"],
            monsterPredicate:
                game.settings.get(MODULE_ID, "armor-refinements") === "all"
                    ? undefined
                    : ["never"],
            effects: armorEffects,
        },
        {
            key: "refinement:armor:light",
            type: "refinement",
            label: tkey(`refinement.armor-light`),
            itemPredicate: ["item:type:armor", "armor:category:light"],
            monsterPredicate:
                game.settings.get(MODULE_ID, "armor-refinements") === "all"
                    ? undefined
                    : ["never"],
            effects: armorEffects,
        },
        {
            key: "refinement:armor:medium",
            type: "refinement",
            label: tkey(`refinement.armor-medium`),
            itemPredicate: ["item:type:armor", "armor:category:medium"],
            monsterPredicate:
                game.settings.get(MODULE_ID, "armor-refinements") === "all"
                    ? undefined
                    : ["never"],
            effects: armorEffects,
        },
        {
            key: "refinement:armor:heavy",
            type: "refinement",
            label: tkey(`refinement.armor-heavy`),
            itemPredicate: ["item:type:armor", "armor:category:heavy"],
            monsterPredicate:
                game.settings.get(MODULE_ID, "armor-refinements") === "all"
                    ? undefined
                    : ["never"],
            effects: armorEffects,
        },
        {
            key: "refinement:shield",
            type: "refinement",
            label: tkey(`refinement.shield.label`),
            itemPredicate: ["item:type:shield", { not: "shield:base:buckler" }],
            monsterPredicate: [
                {
                    or: [
                        { gte: ["self:hardness", 0] },
                        { gte: ["self:resistance:physical", 0] },
                        { gte: ["self:resistance:bludgeoning", 0] },
                        { gte: ["self:resistance:piercing", 0] },
                        { gte: ["self:resistance:slashing", 0] },
                    ],
                },
            ],
            effects: shieldEffects,
        },
        {
            key: "refinement:shield:buckler",
            type: "refinement",
            label: tkey(`refinement.shield.label-buckler`),
            itemPredicate: ["item:type:shield", "shield:base:buckler"],
            monsterPredicate: [
                {
                    or: [
                        { gte: ["self:hardness", 0] },
                        { gte: ["self:resistance:physical", 0] },
                        { gte: ["self:resistance:bludgeoning", 0] },
                        { gte: ["self:resistance:piercing", 0] },
                        { gte: ["self:resistance:slashing", 0] },
                    ],
                },
            ],
            effects: bucklerEffects,
        },

        ...skills.map((s) => skillRefinement(s)),

        {
            key: "refinement:perception",
            type: "refinement",
            label: tkey(`refinement.perception`),
            monsterPredicate: [predicateAnySense()],
            itemPredicate: ["item:type:equipment"],
            effects: skillEffects("perception", tkey(`refinement.perception`)),
        },
    ];
    return refines;
}
