import { MaterialData } from "../material";
import { helpers } from "../helpers";

export function addWeaponRefinements(): MaterialData[] {
    const damageTypes = ["bludgeoning", "piercing", "slashing"] as (
        | "bludgeoning"
        | "piercing"
        | "slashing"
    )[];
    return damageTypes.map((damage) => ({
        key: `refinement:weapon:${damage}`,
        type: "refinement",
        label: {
            type: "key",
            key: `pf2e-monster-parts.data.refinement.${damage}`,
        },
        itemPredicate: ["item:type:weapon", `item:damage:type:${damage}`],
        monsterPredicate: ["item:type:melee", `item:damage:type:${damage}`],
        header: {
            labels: [
                {
                    levelMin: 2,
                    levelMax: 3,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.refinement.weapon.+1",
                    },
                },
                {
                    levelMin: 4,
                    levelMax: 9,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.refinement.weapon.striking+1",
                    },
                },
                {
                    levelMin: 10,
                    levelMax: 11,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.refinement.weapon.striking+2",
                    },
                },
                {
                    levelMin: 12,
                    levelMax: 15,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.refinement.weapon.greater-striking+2",
                    },
                },
                {
                    levelMin: 16,
                    levelMax: 18,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.refinement.weapon.greater-striking+3",
                    },
                },
                {
                    levelMin: 19,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.refinement.weapon.major-striking+3",
                    },
                },
            ],
        },
        effects: [
            {
                levelMin: 2,
                rule: {
                    key: "ItemAlteration",
                    mode: "add",
                    property: "traits",
                    value: "magical",
                    itemId: "{item|id}",
                },
                type: "RuleElement",
            },
            // potency
            ...helpers.leveledEffects([2, 10, 16], [1, 2, 3], (value) => ({
                rule: {
                    key: "ItemAlteration",
                    mode: "upgrade",
                    property: "potency",
                    value: value,
                    itemId: "{item|id}",
                },
                type: "RuleElement",
            })),
            // striking
            ...helpers.leveledEffects([4, 12, 19], [1, 2, 3], (value) => ({
                rule: {
                    key: "ItemAlteration",
                    mode: "upgrade",
                    property: "striking",
                    value: value,
                    itemId: "{item|id}",
                },
                type: "RuleElement",
            })),
        ],
    }));
}
