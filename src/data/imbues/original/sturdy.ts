import { tkey } from "../../../utils";
import { MaterialData } from "../../material";

export function createImbueSturdy(): MaterialData {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.sturdy"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.sturdy.${k}`);

    return {
        key: "imbue:sturdy",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
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
                        text: {
                            type: "key" as "key",
                            key: lkey("effect"),
                            parameters: { hardness: 3 },
                        },
                        predicate: [
                            { lte: ["item:level", l] as [string, number] },
                        ],
                    },
                    {
                        levelMin: l,
                        levelMax: l == 20 ? undefined : l,
                        text: {
                            type: "key" as "key",
                            key: lkey("effect"),
                            parameters: { hardness: 2 },
                        },
                        predicate: [
                            { eq: ["item:level", l + 1] as [string, number] },
                        ],
                    },
                    {
                        levelMin: l,
                        levelMax: l == 20 ? undefined : l,
                        text: {
                            type: "key" as "key",
                            key: lkey("effect"),
                            parameters: { hardness: 1 },
                        },
                        predicate: [
                            { eq: ["item:level", l + 2] as [string, number] },
                        ],
                    },
                    {
                        levelMin: l,
                        levelMax: l == 20 ? undefined : l,
                        text: { type: "key" as "key", key: lkey("no-effect") },
                        predicate: [
                            { gt: ["item:level", l + 2] as [string, number] },
                        ],
                    },
                ]),
            ],
        },
        effects: [
            ...Array.fromRange(20, 1).flatMap((l) => [
                {
                    type: "RuleElement" as "RuleElement",
                    levelMin: l,
                    levelMax: l == 20 ? undefined : l,
                    rule: {
                        key: "ItemAlteration",
                        property: "hardness",
                        mode: "add",
                        value: `${l} -@item.level +3`,
                        itemId: "{item|id}",
                        priority: 200,
                        predicate: [
                            { lte: ["item:level", l + 2] as [string, number] },
                        ],
                    },
                },
                {
                    type: "RuleElement" as "RuleElement",
                    levelMin: l,
                    levelMax: l == 20 ? undefined : l,
                    rule: {
                        key: "ItemAlteration",
                        property: "hp-max",
                        mode: "add",
                        value: `@item.hardness *2`,
                        itemId: "{item|id}",
                        priority: 300,
                        predicate: [
                            { lte: ["item:level", l + 2] as [string, number] },
                        ],
                    },
                },
            ]),
        ],
    };
}
