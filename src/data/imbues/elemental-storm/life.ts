import { tkey } from "../../../utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "../../../types";

export function createImbueLife(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.elemental-storm.life"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.elemental-storm.life.${k}`);
    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:vitality",
                    {
                        or: [
                            {
                                and: [
                                    "item:type:melee",
                                    "item:damage:type:vitality",
                                ],
                            },
                            {
                                and: [
                                    "item:type:spell",
                                    "item:damage:type:vitality",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    return [
        {
            ...base,
            key: "imbue:life:magic",
            label: { type: "key", key: lkey("magic.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [10, 14, 18],
                        ["1", "d4", "d6"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "vitality",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.kcelf6IHl3L9VXXg]" as I18nString,
                            },
                        },
                        sort: 1,
                    },
                    ...helpers.leveledLabels(
                        [4, 6, 8, 12, 16, 20],
                        [
                            "magic.level-4-spells",
                            "magic.level-6-spells",
                            "magic.level-8-spells",
                            "magic.level-12-spells",
                            "magic.level-16-spells",
                            "magic.level-20-spells",
                        ],
                        (key: Parameters<typeof lkey>[0]) => ({
                            text: { type: "key", key: lkey(key) },
                            sort: 2,
                        }),
                    ),
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [10, 14, 18],
                    ["1", "d4", "d6"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "vitality",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:life:might",
            label: { type: "key", key: lkey("might.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [2, 4, 6, 18],
                        ["1", "d4", "d6", "d8"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "vitality",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 6,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("might.level-6-enfeebled"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 10,
                        text: {
                            type: "key",
                            key: lkey("might.level-10-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("might.level-14-enfeebled"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("might.level-20-weakness"),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [2, 4, 6, 18],
                    ["1", "d4", "d6", "d8"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "vitality",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:life:tech",
            label: { type: "key", key: lkey("tech.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 4,
                        ...helpers.damage.label({
                            type: "vitality",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [2, 6, 12, 18],
                        ["1", "d6", "d8", "d10"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "vitality",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 6,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("tech.level-6-enfeebled"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 10,
                        text: {
                            type: "key",
                            key: lkey("tech.level-10-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("tech.level-14-enfeebled"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.level-20-counteract"),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 4,
                    ...helpers.damage.effect({
                        type: "vitality",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [2, 6, 12, 18],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "vitality",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
            ],
        },
    ];
}
