import { tkey } from "../../../utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";

export function createImbueFortification(): MaterialData {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.fortification"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.fortification.${k}`);

    return {
        key: "imbue:fortification",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
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
        header: {
            description: { type: "key", key: lkey("flavor") },
            labels: [
                {
                    levelMin: 0,
                    text: {
                        type: "key",
                        key: lkey("penalty"),
                    },
                    sort: 1,
                },

                ...helpers.leveledLabels(
                    [6, 8, 10, 12, 14, 16, 18, 20],
                    [20, 19, 18, 17, 16, 15, 14, 13],
                    (dc) => ({
                        text: {
                            type: "key",
                            key: lkey("flat-check"),
                            parameters: { dc },
                        },
                        sort: 2,
                    }),
                ),
            ],
        },
        effects: [
            {
                levelMin: 0,
                type: "RuleElement",
                rule: {
                    key: "ItemAlteration",
                    mode: "add",
                    property: "bulk",
                    value: 1,
                    itemId: "{item|id}",
                },
            },
            {
                levelMin: 0,
                type: "RuleElement",
                rule: {
                    key: "ItemAlteration",
                    mode: "add",
                    property: "strength",
                    value: 1,
                    itemId: "{item|id}",
                },
            },
        ],
    };
}
