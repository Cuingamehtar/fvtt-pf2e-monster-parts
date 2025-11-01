import { MaterialData } from "../material";
import { helpers } from "../helpers";

export function addHandwrapsRefinement(): MaterialData {
    return {
        key: `refinement:handwraps`,
        type: "refinement",
        label: {
            type: "key",
            key: `pf2e-monster-parts.data.refinement.handwraps`,
        },
        itemPredicate: ["item:handwraps-of-mighty-blows"],
        monsterPredicate: ["item:type:melee", `item:damage:type:bludgeoning`],
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
            // potency
            ...helpers.leveledEffects([2, 10, 16], [1, 2, 3], (value) => ({
                property: "system.runes.potency",
                value,
                editData: true,
                type: "Alteration",
            })),
            // striking
            ...helpers.leveledEffects([4, 12, 19], [1, 2, 3], (value) => ({
                property: "system.runes.striking",
                value,
                editData: true,
                type: "Alteration",
            })),
        ],
    };
}
