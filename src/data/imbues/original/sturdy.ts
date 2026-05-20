import { I18n, lkeygen } from "@src/utils";
import { MaterialData } from "../../material";

export function createImbueSturdy(): MaterialData {
    const lkey = lkeygen("data.imbuement.battlezoo-bestiary.sturdy" as const);

    return {
        key: "imbue:sturdy",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:shield"],
        monsterPredicate: [
            {
                or: [
                    { gt: ["self:hardness", 0] },
                    { gt: ["self:resistance:physical", 0] },
                    { gt: ["self:resistance:bludgeoning", 0] },
                    { gt: ["self:resistance:piercing", 0] },
                    { gt: ["self:resistance:slashing", 0] },
                ],
            },
        ],
        header: {
            description: { type: "key", key: lkey("flavor") },
            labels: [
                ...Array.fromRange(20, 1).flatMap((l) => [
                    {
                        levelMin: l,
                        levelMax: l == 20 ? undefined : l,
                        text: I18n.key(lkey("effect"), { hardness: 3 }),
                        predicate: [
                            { lte: ["item:level", l] as [string, number] },
                        ],
                    },
                    {
                        levelMin: l,
                        levelMax: l == 20 ? undefined : l,
                        text: I18n.key(lkey("effect"), { hardness: 2 }),
                        predicate: [
                            { eq: ["item:level", l + 1] as [string, number] },
                        ],
                    },
                    {
                        levelMin: l,
                        levelMax: l == 20 ? undefined : l,
                        text: I18n.key(lkey("effect"), { hardness: 1 }),
                        predicate: [
                            { eq: ["item:level", l + 2] as [string, number] },
                        ],
                    },
                    {
                        levelMin: l,
                        levelMax: l == 20 ? undefined : l,
                        text: I18n.key(lkey("no-effect")),
                        predicate: [
                            { gt: ["item:level", l + 2] as [string, number] },
                        ],
                    },
                ]),
            ],
        },
        effects: [
            {
                type: "RuleElement",
                levelMin: 1,
                rule: {
                    key: "ItemAlteration",
                    property: "hardness",
                    mode: "add",
                    value: "clamp(@item.flags.pf2e-monster-parts.values.imbueSturdyLevel.value -@item.flags.pf2e-monster-parts.values.refinementShieldLevel.value +3, 0,3)",
                    itemId: "{item|id}",
                    priority: 200,
                },
            },
            {
                type: "RuleElement",
                levelMin: 1,
                rule: {
                    key: "ItemAlteration",
                    property: "hp-max",
                    mode: "upgrade",
                    value: "@item.hitPoints.max+ ternary(lte(@item.flags.pf2e-monster-parts.values.refinementShieldLevel.value, @item.flags.pf2e-monster-parts.values.imbueSturdyLevel.value +2), @item.hardness *2,0)",
                    itemId: "{item|id}",
                    priority: 300,
                },
            },
        ],
    };
}
