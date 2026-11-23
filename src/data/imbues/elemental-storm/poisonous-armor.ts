import { I18n, lkeygen } from "@src/utils";
import { MaterialData } from "../../material";
import * as R from "remeda";
import { helpers } from "@data/helpers";

export function createImbuePoisonousArmor(): MaterialData {
    const lkey = lkeygen(
        "data.imbuement.elemental-storm.poisonous-armor" as const,
    );

    const base: MaterialData = {
        type: "imbuement" as const,
        key: "imbue:poisonous-armor",
        label: I18n.key(lkey("label")),
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:armor"],
        // The monster must have the poison trait or an ability or spell with
        // the poison trait.
        monsterPredicate: [
            {
                or: [
                    "self:trait:poison",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:melee",
                                    "item:type:spell",
                                ],
                            },
                            "item:trait:poison",
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
                [6, 10, 18],
                [
                    "header.level-6-swallow-whole",
                    "header.level-10-swallow-whole",
                    "header.level-18-swallow-whole",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: I18n.key(lkey(key)),
                    sort: 1,
                }),
            ),
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [8, 14],
                ["header.level-8-bitten", "header.level-14-bitten"],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: I18n.key(lkey(key)),
                    sort: 2,
                }),
            ),
        }),

        helpers.addGroup({
            labels: {
                levelMin: 12,
                text: I18n.key(lkey("header.level-12-increase"), {
                    max: I18n.resolve("@material.level *2", true),
                }),
                sort: 3,
            },
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [16, 20],
                ["header.level-16-contact", "header.level-20-contact"],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: I18n.key(lkey(key)),
                    sort: 4,
                }),
            ),
        }),
    );
}
