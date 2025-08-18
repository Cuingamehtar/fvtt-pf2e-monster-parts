import { ImbueSource, MaterialEffectSource } from "../../data-types";
import { t, tkey } from "../../../utils";
import { levelRange } from "../../helpers";

export function createImbueFortification(): ImbueSource {
    return {
        key: "imbue:fortification",
        type: "imbue",
        label: t("imbue.fortification.label"),
        flavor: t("imbue.fortification.flavor"),
        itemPredicate: [
            "item:type:armor",
            { or: ["armor:category:medium", "armor:category:heavy"] },
        ],
        monsterPredicate: [
            {
                or: [
                    "self:resistance:critical-hits",
                    "self:immunity:critical-hits",
                    "self:resistance:precision",
                    "self:immunity:precision",
                ],
            },
        ],
        effects: [
            {
                ...levelRange(0),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.fortification.penalty"),
                    },
                    {
                        key: "RuleElement",
                        rule: {
                            key: "ItemAlteration",
                            mode: "add",
                            property: "bulk",
                            value: 1,
                            itemId: "{item|id}",
                        },
                    },
                    {
                        key: "RuleElement",
                        rule: {
                            key: "ItemAlteration",
                            mode: "add",
                            property: "strength",
                            value: 1,
                            itemId: "{item|id}",
                        },
                    },
                ],
            },
            ...[
                [6, 7, 20],
                [8, 9, 19],
                [10, 11, 18],
                [12, 13, 17],
                [14, 15, 16],
                [16, 17, 15],
                [18, 19, 14],
                [20, undefined, 13],
            ].map(([from, to, dc]): MaterialEffectSource => {
                return {
                    ...levelRange(from!, to),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fortification.flat-check"),
                            parameters: { dc: dc },
                        },
                    ],
                };
            }),
        ],
    };
}
