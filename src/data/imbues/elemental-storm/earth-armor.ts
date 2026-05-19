import { I18n, lkeygen } from "@src/utils";
import { MaterialData } from "../../material";
import * as R from "remeda";
import { helpers } from "@data/helpers";

export function createImbueEarthArmor(): MaterialData {
    const lkey = lkeygen("data.imbuement.elemental-storm.earth-armor" as const);

    const base: MaterialData = {
        type: "imbuement" as const,
        key: "imbue:earth-armor",
        label: I18n.key(lkey("label")),
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:armor"],
        // The monster must have the earth trait or an ability or spell with
        // the earth trait.
        monsterPredicate: [
            {
                or: [
                    "self:trait:earth",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:melee",
                                    "item:type:spell",
                                ],
                            },
                            "item:trait:earth",
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
            labels: helpers.leveledLabels([6, 12], [1, 2], (bonus) => ({
                text: I18n.key(lkey("header.level-6-bonus"), { bonus }),
                sort: 1,
            })),
            effects: helpers.leveledEffects([6, 12], [1, 2], (bonus) => ({
                type: "RuleElement",
                rule: {
                    key: "FlatModifier",
                    selector: ["fortitude-dc", "reflex-dc", "will-dc"],
                    predicate: [{ or: ["forced-movement", "inflics:prone"] }],
                    type: "item",
                    value: `@item.system.runes.resilient +${bonus}`,
                    label: I18n.key(lkey("label")),
                },
            })),
        }),
        helpers.addGroup({
            labels: {
                levelMin: 16,
                text: I18n.key(lkey("header.level-16-reflex")),
                sort: 2,
            },
            effects: {
                levelMin: 16,
                type: "RuleElement",
                rule: {
                    key: "FlatModifier",
                    selector: "reflex-dc",
                    predicate: ["action:tumble-through"],
                    type: "item",
                    value: "@item.system.runes.resilient +2",
                    label: lkey("label"),
                },
            },
        }),
        helpers.addLabels(
            helpers.leveledLabels(
                [8, 10, 18],
                [
                    "header.level-8-reduction",
                    "header.level-10-reduction",
                    "header.level-18-reduction",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: I18n.key(lkey(key)),
                    sort: 3,
                }),
            ),
        ),
        helpers.addLabels({
            levelMin: 14,
            text: I18n.key(lkey("header.level-14-cover")),
            sort: 4,
        }),
        helpers.addLabels({
            levelMin: 20,
            text: I18n.key(lkey("header.level-20-activation")),
            sort: 5,
        }),
    );
}
