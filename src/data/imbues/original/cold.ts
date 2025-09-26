import { tkey } from "../../../utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "../../../types";

export function createImbueCold(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.cold"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.cold.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:cold",
                    {
                        or: [
                            {
                                and: [
                                    "item:type:melee",
                                    "item:damage:type:cold",
                                ],
                            },
                            {
                                and: [
                                    "item:type:spell",
                                    "item:damage:type:cold",
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
            key: "imbue:cold:magic",
            label: { type: "key", key: lkey("magic.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [8, 14, 18],
                        ["1", "d4", "d6"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "cold",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.gYjPm7YwGtEa1oxh]" as I18nString,
                            },
                        },
                        sort: 1,
                    },
                    ...helpers.leveledLabels(
                        [4, 6, 10, 12, 16],
                        [
                            "magic.level-4-spells",
                            "magic.level-6-spells",
                            "magic.level-10-spells",
                            "magic.level-12-spells",
                            "magic.level-16-spells",
                        ],
                        (key: Parameters<typeof lkey>[0]) => ({
                            text: { type: "key", key: lkey(key) },
                            sort: 2,
                        }),
                    ),
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("magic.level-20-polar-ray"),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [8, 14, 18],
                    ["1", "d4", "d6"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "cold",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:cold:might",
            label: { type: "key", key: lkey("might.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [4, 6, 8, 18],
                        ["1", "d4", "d6", "d8"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "cold",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("might.level-8-slowed"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("might.level-12-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("might.level-14-slowed"),
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
                    [4, 6, 8, 18],
                    ["1", "d4", "d6", "d8"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "cold",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:cold:tech",
            label: { type: "key", key: lkey("tech.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [4, 18],
                        ["1", "d4"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "cold",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    ...helpers.leveledLabels(
                        [6, 8, 20],
                        [
                            "tech.level-6-slow",
                            "tech.level-8-slow",
                            "tech.level-20-slow",
                        ],
                        (key: Parameters<typeof lkey>[0]) => ({
                            text: { type: "key", key: lkey(key) },
                            sort: 1,
                        }),
                    ),
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("tech.level-12-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("tech.level-14-thaw"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.level-16-surface"),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [4, 18],
                    ["1", "d4"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "cold",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
            ],
        },
    ];
}
