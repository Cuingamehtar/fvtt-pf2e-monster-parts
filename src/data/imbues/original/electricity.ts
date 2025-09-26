import { tkey } from "../../../utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "../../../types";

export function createImbueElectricity(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.electricity"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.electricity.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:electricity",
                    {
                        or: [
                            {
                                and: [
                                    "item:type:melee",
                                    "item:damage:type:electricity",
                                ],
                            },
                            {
                                and: [
                                    "item:type:spell",
                                    "item:damage:type:electricity",
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
            key: "imbue:electricity:magic",
            label: { type: "key", key: lkey("magic.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [10, 14, 18],
                        ["1", "d4", "d6"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "electricity",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.kBhaPuzLUSwS6vVf]",
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
                            type: "electricity",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:electricity:might",
            label: { type: "key", key: lkey("might.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [4, 6, 8, 18],
                        ["1", "d4", "d6", "d8"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "electricity",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("might.level-8-arc"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("might.level-14-arc"),
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
                            type: "electricity",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:electricity:tech",
            label: { type: "key", key: lkey("tech.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "electricity",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 8, 14, 18],
                        ["1", "d6", "d8", "d10"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "electricity",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 15,
                        text: {
                            type: "key",
                            key: lkey("tech.level-8-arc"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.level-16-arc"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("tech.level-12-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.level-20-magnetized"),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 6,
                    ...helpers.damage.effect({
                        type: "electricity",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 8, 14, 18],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "electricity",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
            ],
        },
    ];
}
