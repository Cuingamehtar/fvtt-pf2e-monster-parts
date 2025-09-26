import { HeaderLabel, MaterialData, MaterialEffect } from "../material";
import { addTraits, helpers, shield } from "../helpers";

export function addShieldRefinements(): MaterialData[] {
    const monsterPredicate = [
        {
            or: [
                {
                    gte: ["self:hardness", 0] as [string, number],
                },
                {
                    gte: ["self:resistance:physical", 0] as [string, number],
                },
                {
                    gte: ["self:resistance:bludgeoning", 0] as [string, number],
                },
                {
                    gte: ["self:resistance:piercing", 0] as [string, number],
                },
                {
                    gte: ["self:resistance:slashing", 0] as [string, number],
                },
            ],
        },
    ];

    const shieldEffectLevels = [
        3, 5, 7, 8, 9, 19, 12, 13, 15, 16, 17, 18, 19, 20,
    ];
    // level from / level to / hardness / hp
    const shieldEffectValues = [
        { hardness: 5, hp: 30 },
        { hardness: 6, hp: 36 },
        { hardness: 7, hp: 42 },
        { hardness: 8, hp: 48 },
        { hardness: 9, hp: 54 },
        { hardness: 10, hp: 60 },
        { hardness: 11, hp: 66 },
        { hardness: 12, hp: 72 },
        { hardness: 13, hp: 78 },
        { hardness: 14, hp: 84 },
        { hardness: 15, hp: 90 },
        { hardness: 16, hp: 96 },
        { hardness: 17, hp: 102 },
        { hardness: 18, hp: 108 },
    ];

    const bucklerEffectValues = shieldEffectValues.map(({ hardness, hp }) => ({
        hardness: hardness - 2,
        hp: hp - 12,
    }));

    const shieldLabels: HeaderLabel[] = [
        ...helpers.leveledLabels(
            shieldEffectLevels,
            shieldEffectValues,
            ({ hardness, hp }) =>
                shield.label(hp as number, hardness as number),
        ),
        {
            levelMin: 4,
            text: {
                type: "key",
                key: "pf2e-monster-parts.data.refinement.shield.imbuing",
            },
        },
    ];
    const shieldEffects: MaterialEffect[] = [
        ...helpers.leveledEffects(
            shieldEffectLevels,
            shieldEffectValues,
            ({ hp }) => helpers.shield.effectHP(hp),
        ),
        ...helpers.leveledEffects(
            shieldEffectLevels,
            shieldEffectValues,
            ({ hardness }) => helpers.shield.effectHardness(hardness),
        ),
        ...addTraits(["invested", "magical"]).map((r) => ({
            levelMin: 4,
            ...r,
        })),
    ];

    const bucklerLabels: HeaderLabel[] = [
        ...helpers.leveledLabels(
            shieldEffectLevels,
            bucklerEffectValues,
            ({ hardness, hp }) =>
                shield.label(hp as number, hardness as number),
        ),
        {
            levelMin: 4,
            text: {
                type: "key",
                key: "pf2e-monster-parts.data.refinement.shield.imbuing",
            },
        },
    ];

    const bucklerEffects: MaterialEffect[] = [
        ...helpers.leveledEffects(
            shieldEffectLevels,
            bucklerEffectValues,
            ({ hp }) => helpers.shield.effectHP(hp),
        ),
        ...helpers.leveledEffects(
            shieldEffectLevels,
            bucklerEffectValues,
            ({ hardness }) => helpers.shield.effectHardness(hardness),
        ),
        ...addTraits(["invested", "magical"]).map((r) => ({
            levelMin: 4,
            ...r,
        })),
    ];

    return [
        {
            key: "refinement:shield",
            type: "refinement",
            label: {
                type: "key",
                key: "pf2e-monster-parts.data.refinement.shield.label",
            },
            itemPredicate: [
                "item:type:shield",
                {
                    not: "item:base:buckler",
                },
            ],
            monsterPredicate,
            header: {
                labels: shieldLabels,
            },
            effects: shieldEffects,
        },
        {
            key: "refinement:shield:buckler",
            type: "refinement",
            label: {
                type: "key",
                key: "pf2e-monster-parts.data.refinement.shield.label-buckler",
            },
            itemPredicate: ["item:type:shield", "item:base:buckler"],
            monsterPredicate,
            header: {
                labels: bucklerLabels,
            },
            effects: bucklerEffects,
        },
    ];
}
