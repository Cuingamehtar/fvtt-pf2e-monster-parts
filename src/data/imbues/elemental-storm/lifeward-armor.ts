import { I18n, lkeygen } from "@src/utils";
import { MaterialData } from "../../material";
import * as R from "remeda";
import { helpers } from "@data/helpers";

export function createImbueLifewardArmor(): MaterialData {
    const lkey = lkeygen(
        "data.imbuement.elemental-storm.lifeward-armor" as const,
    );

    const base: MaterialData = {
        type: "imbuement" as const,
        key: "imbue:lifeward-armor",
        label: I18n.key(lkey("label")),
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:armor"],
        // The monster must have the vitality trait or an ability or spell that
        // deals vitality damage.
        monsterPredicate: [
            {
                or: [
                    "self:trait:vitality",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:melee",
                                    "item:type:spell",
                                ],
                            },
                            "item:damage:type:vitality",
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
            labels: {
                levelMin: 6,
                text: I18n.key(lkey("header.level-6-buffer"), {
                    buffer: I18n.resolve("floor(@material.level * 1.5)", true),
                }),
                sort: 1,
            },
            effects: {
                levelMin: 6,
                type: "RuleElement",
                rule: {
                    key: "SpecialResource",
                    slug: "lifeward-armor-buffer",
                    label: lkey("buffer-label"),
                    max: I18n.resolve("floor(@material.level * 1.5)", true),
                },
            },
        }),
        helpers.addLabels(
            helpers.leveledLabels(
                [10, 14],
                ["header.level-10-recovery", "header.level-10-recovery"],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: I18n.key(lkey(key)),
                    sort: 2,
                }),
            ),
        ),
        helpers.addLabels({
            levelMin: 12,
            text: I18n.key(lkey("header.level-12-negation")),
            sort: 3,
        }),
        helpers.addGroup({
            labels: {
                levelMin: 16,
                text: I18n.key(lkey("header.level-16-bonus")),
                sort: 4,
            },
            effects: {
                levelMin: 16,
                type: "RuleElement",
                rule: {
                    key: "FlatModifier",
                    selector: ["saving-throw"],
                    predicate: [
                        {
                            gt: [
                                "{actor|system.resources.lifewardArmorBuffer.value}",
                                0,
                            ],
                        },
                    ],
                    type: "item",
                    value: `@item.system.runes.resilient +1`,
                    label: lkey("label"),
                },
            },
        }),
        helpers.addLabels({
            levelMin: 18,
            text: I18n.key(lkey("header.level-18-activation")),
            sort: 6,
        }),
        helpers.addLabels({
            levelMin: 20,
            text: I18n.key(lkey("header.level-20-dying")),
            sort: 5,
        }),
    );
}
