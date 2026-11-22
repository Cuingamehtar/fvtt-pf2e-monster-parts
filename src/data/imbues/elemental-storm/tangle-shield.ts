import { I18n, lkeygen } from "@src/utils";
import { MaterialData } from "../../material";
import * as R from "remeda";
import { helpers } from "@data/helpers";

export function createImbueTangleShield(): MaterialData {
    const lkey = lkeygen(
        "data.imbuement.elemental-storm.tangle-shield" as const,
    );

    const base: MaterialData = {
        type: "imbuement" as const,
        key: "imbue:tangle-shield",
        label: I18n.key(lkey("label")),
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:shield"],
        // The creature must have the plant or wood trait or have an ability or
        //   spell with the plant or wood trait.
        monsterPredicate: [
            {
                or: [
                    "self:trait:plant",
                    "self:trait:wood",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:spell",
                                    "item:type:melee",
                                ],
                            },
                            { or: ["self:trait:plant", "self:trait:wood"] },
                        ],
                    },
                ],
            },
        ],
        header: {
            description: I18n.key(lkey("header.flavor")),
        },
    };

    return R.pipe(
        base,

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [4, 6, 8, 10, 12, 16, 18],
                [
                    "header.level-4-shield-block",
                    "header.level-6-shield-block",
                    "header.level-8-shield-block",
                    "header.level-10-shield-block",
                    "header.level-12-shield-block",
                    "header.level-16-shield-block",
                    "header.level-18-shield-block",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: I18n.key(lkey(key)),
                    sort: 1,
                }),
            ),
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [14, 20],
                [
                    "header.level-14-raise-shield",
                    "header.level-20-raise-shield",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: I18n.key(lkey(key)),
                    sort: 2,
                }),
            ),
        }),
    );
}
