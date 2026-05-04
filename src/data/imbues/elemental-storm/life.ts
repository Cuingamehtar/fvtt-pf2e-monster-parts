import { tkey } from "@src/utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "@localTypes/global";

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
            description: { type: "key", key: lkey("magic.description") },
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
                            "magic.header.level-4-spells",
                            "magic.header.level-6-spells",
                            "magic.header.level-8-spells",
                            "magic.header.level-12-spells",
                            "magic.header.level-16-spells",
                            "magic.header.level-20-spells",
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
                ...helpers.cantripActivation({
                    uuid: "Compendium.pf2e.spells-srd.Item.kcelf6IHl3L9VXXg", // Vitality Lash
                }),
                ...helpers.leveledEffects(
                    [4, 6, 12, 16, 20],
                    [1, 2, 4, 5, 8],
                    (rank) =>
                        helpers.spellActivation({
                            uuid: "Compendium.pf2e.spells-srd.Item.rfZpqmj0AIIdkVIs", // Heal
                            max: 1,
                            rank,
                        }),
                ),
                ...helpers.leveledEffects([8, 16], [3, 5], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.2iQKhCQBijhj5Rf3", // Infuse Vitality
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 12,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.Hnc7eGi7vyZenAIm", // Breath of Life
                        max: 1,
                        rank: 5,
                    }),
                },
                ...helpers.leveledEffects([16, 20], [7, 8], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.2Vkd1IxylPceUAAF", // Regenerate
                        max: 1,
                        rank,
                    }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:life:might",
            label: { type: "key", key: lkey("might.label") },
            description: { type: "key", key: lkey("might.description") },
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
                            key: lkey("might.header.level-6-enfeebled"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 10,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-10-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-14-enfeebled"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-20-weakness"),
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
                ...helpers.leveledEffects(
                    [10, 14],
                    [
                        "might.effects.level-6-enfeebled",
                        "might.effects.level-14-enfeebled",
                    ],
                    (k: Parameters<typeof lkey>[0]) => ({
                        type: "RuleElement",
                        rule: {
                            key: "Note",
                            outcome: ["criticalSuccess"],
                            text: lkey(k),
                            title: lkey("might.label"),
                            selector: ["{item|id}-attack"],
                        },
                    }),
                ),
                {
                    levelMin: 10,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("might.effects.level-10-resistance"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
                {
                    levelMin: 20,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("might.effects.level-20-weakness"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-attack"],
                    },
                },
            ],
        },
        {
            ...base,
            key: "imbue:life:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
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
                            key: lkey("tech.header.level-6-enfeebled"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 10,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-10-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-14-enfeebled"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-20-counteract"),
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
                ...helpers.leveledEffects(
                    [6, 14],
                    [
                        "tech.effects.level-6-enfeebled",
                        "tech.effects.level-14-enfeebled",
                    ],
                    (k: Parameters<typeof lkey>[0]) => ({
                        type: "RuleElement",
                        rule: {
                            key: "Note",
                            outcome: ["criticalSuccess"],
                            text: lkey(k),
                            title: lkey("tech.label"),
                            selector: ["{item|id}-attack"],
                        },
                    }),
                ),
                {
                    levelMin: 10,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-10-resistance"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
                {
                    levelMin: 20,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("tech.effects.level-20-counteract"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
            ],
        },
    ];
}
