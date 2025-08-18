import { ImbueSource } from "../../data-types";
import { t, tkey } from "../../../utils";
import { levelRange } from "../../helpers";

export function createImbueSturdy(): ImbueSource {
    return {
        key: "imbue:sturdy",
        type: "imbue",
        label: t("imbue.sturdy.label"),
        flavor: t("imbue.sturdy.flavor"),
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
        effects: Array.fromRange(20, 1).map((imbueLevel) => ({
            ...levelRange(
                imbueLevel,
                imbueLevel == 20 ? undefined : imbueLevel,
            ),
            effects: [
                {
                    key: "InlineNote",
                    predicate: [{ lte: ["shield:level", imbueLevel] }],
                    text: tkey("imbue.sturdy.effect"),
                    parameters: { hardiness: 3, hp: 6, bt: 3 },
                },
                {
                    key: "InlineNote",
                    predicate: [{ eq: ["shield:level", imbueLevel + 1] }],
                    text: tkey("imbue.sturdy.effect"),
                    parameters: { hardiness: 2, hp: 4, bt: 2 },
                },
                {
                    key: "InlineNote",
                    predicate: [{ eq: ["shield:level", imbueLevel + 2] }],
                    text: tkey("imbue.sturdy.effect"),
                    parameters: { hardiness: 1, hp: 2, bt: 1 },
                },
                {
                    key: "RuleElement",
                    rule: {
                        key: "ItemAlteration",
                        property: "hp-max",
                        mode: "add",
                        value: `(${imbueLevel} -@item.level +3)*2`,
                        itemId: "{item|id}",
                        priority: 200,
                        predicate: [{ lte: ["item:level", imbueLevel + 2] }],
                    },
                },
                {
                    key: "RuleElement",
                    rule: {
                        key: "ItemAlteration",
                        property: "hardness",
                        mode: "add",
                        value: `${imbueLevel} -@item.level +3`,
                        itemId: "{item|id}",
                        priority: 200,
                        predicate: [{ lte: ["item:level", imbueLevel + 2] }],
                    },
                },
            ],
        })),
    };
}
