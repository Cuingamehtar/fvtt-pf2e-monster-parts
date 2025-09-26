import { MaterialData } from "../material";
import { MODULE_ID } from "../../module";
import { ArmorCategory } from "foundry-pf2e";
import { helpers } from "../helpers";

export function addArmorRefinements(): MaterialData[] {
    const monsterPredicate =
        game.settings.get(MODULE_ID, "armor-refinements") === "all"
            ? []
            : ["never"];
    const armorTypes = ["unarmored", "light", "medium", "heavy"] as Exclude<
        ArmorCategory,
        "light-barding" | "heavy-barding"
    >[];
    return armorTypes.map((armor) => {
        return {
            key: `refinement:armor:${armor}`,
            type: "refinement",
            label: {
                type: "key",
                key: `pf2e-monster-parts.data.refinement.armor-${armor}`,
            },
            itemPredicate: ["item:type:armor", `item:category:${armor}`],
            monsterPredicate: monsterPredicate,
            header: {
                labels: [
                    {
                        levelMin: 5,
                        levelMax: 7,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.armor.+1",
                        },
                    },
                    {
                        levelMin: 8,
                        levelMax: 10,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.armor.resilient+1",
                        },
                    },
                    {
                        levelMin: 11,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.armor.resilient+2",
                        },
                    },
                    {
                        levelMin: 14,
                        levelMax: 17,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.armor.greater-resilient+2",
                        },
                    },
                    {
                        levelMin: 18,
                        levelMax: 19,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.armor.greater-resilient+3",
                        },
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.refinement.armor.major-resilient+3",
                        },
                    },
                ],
            },
            effects: [
                {
                    levelMin: 5,
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
                    levelMin: 5,
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
                ...helpers.leveledEffects([5, 11, 18], [1, 2, 3], (value) => ({
                    rule: {
                        key: "ItemAlteration",
                        mode: "upgrade",
                        property: "potency",
                        value: value,
                        itemId: "{item|id}",
                    },
                    type: "RuleElement",
                })),
                // resilient
                ...helpers.leveledEffects([8, 14, 20], [1, 2, 3], (value) => ({
                    rule: {
                        key: "ItemAlteration",
                        mode: "upgrade",
                        property: "resilient",
                        value: value,
                        itemId: "{item|id}",
                    },
                    type: "RuleElement",
                })),
            ],
        };
    });
}
