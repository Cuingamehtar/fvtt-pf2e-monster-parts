import { tkey } from "@src/utils";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";
import { helpers } from "../../helpers";

export function createImbueAir(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.elemental-storm.air"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.elemental-storm.air.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:air",
                    {
                        or: [
                            {
                                and: [
                                    "item:type:melee",
                                    "item:damage:type:air",
                                ],
                            },
                            {
                                and: [
                                    "item:type:spell",
                                    "item:damage:type:air",
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
            key: "imbue:air:magic",
            label: { type: "key", key: lkey("magic.label") },
            description: { type: "key", key: lkey("magic.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [6, 14, 18],
                        ["1", "d4", "d6"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "slashing",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 6,
                        text: {
                            type: "key",
                            key: lkey("air-trait"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: lkey("magic.header.level-2-cantrip"),
                        },
                        sort: 2,
                    },
                    ...helpers.leveledLabels(
                        [4, 8, 10, 12, 16],
                        [
                            "magic.header.level-4-spells",
                            "magic.header.level-8-spells",
                            "magic.header.level-10-spells",
                            "magic.header.level-12-spells",
                            "magic.header.level-16-spells",
                        ],
                        (key: Parameters<typeof lkey>[0]) => ({
                            text: { type: "key", key: lkey(key) },
                            sort: 3,
                        }),
                    ),
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("magic.header.level-20-wrathful-storm"),
                        },
                        sort: 4,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [6, 14, 18],
                    ["1", "d4", "d6"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "slashing",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
                /*
                ...helpers.cantripActivation({
                    uuid: "rushing gust",
                }),
                */
                {
                    levelMin: 4,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.g8QqHpv2CWDwmIm1", // Gust of Wind
                        max: 1,
                        rank: 1,
                    }),
                },
                {
                    levelMin: 8,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.it4ZsAi6XgvGcodc", // Wall of Wind
                        max: 1,
                        rank: 3,
                    }),
                },
                {
                    levelMin: 10,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.V8wXOsoejQhe6CyG", // Vapor Form
                        max: 1,
                        rank: 4,
                    }),
                },
                /*
                ...helpers.leveledEffects([12, 16], [5, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: "launching vortex",
                        max: 1,
                        rank,
                    }),
                ),
                 */
                {
                    levelMin: 20,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.yLJROsQtyrPIKcDx", // Wrathful Storm
                        max: 1,
                        rank: 9,
                    }),
                },
            ],
        },
        {
            ...base,
            key: "imbue:air:might",
            label: { type: "key", key: lkey("might.label") },
            description: { type: "key", key: lkey("might.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [4, 6, 8, 18],
                        ["1", "d4", "d6", "d8"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "slashing",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 4,
                        text: {
                            type: "key",
                            key: lkey("air-trait"),
                        },
                        sort: 1,
                    },
                    ...helpers.leveledLabels(
                        [8, 14],
                        [
                            "might.header.level-8-push",
                            "might.header.level-14-push",
                        ],
                        (key: Parameters<typeof lkey>[0]) => ({
                            text: { type: "key", key: lkey(key) },
                            sort: 2,
                        }),
                    ),
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-12-resistance"),
                        },
                        sort: 3,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-20-weakness"),
                        },
                        sort: 4,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [4, 6, 8, 18],
                    ["1", "d4", "d6", "d8"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "slashing",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 14],
                    [
                        "might.effects.level-8-push",
                        "might.effects.level-14-push",
                    ],
                    (l: Parameters<typeof lkey>[0]) => ({
                        type: "RuleElement",
                        rule: {
                            key: "Note",
                            outcome: ["criticalSuccess"],
                            text: lkey(l),
                            title: lkey("might.label"),
                            selector: ["{item|id}-damage"],
                        },
                    }),
                ),
                {
                    levelMin: 12,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("might.effects.level-12-resistance"),
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
            key: "imbue:air:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "slashing",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 8, 14, 18],
                        ["1", "d6", "d8", "d10"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "slashing",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 4,
                        text: {
                            type: "key",
                            key: lkey("air-trait"),
                        },
                        sort: 1,
                    },
                    ...helpers.leveledLabels(
                        [8, 16, 20],
                        [
                            "tech.header.level-8-push",
                            "tech.header.level-16-push",
                            "tech.header.level-20-push",
                        ],
                        (key: Parameters<typeof lkey>[0]) => ({
                            text: { type: "key", key: lkey(key) },
                            sort: 2,
                        }),
                    ),
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-12-resistance"),
                        },
                        sort: 3,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-16-hazardous"),
                        },
                        sort: 4,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 6,
                    ...helpers.damage.effect({
                        type: "slashing",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 8, 14, 18],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "slashing",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 16, 20],
                    [
                        "tech.effects.level-8-push",
                        "tech.effects.level-16-push",
                        "tech.effects.level-20-push",
                    ],
                    (l: Parameters<typeof lkey>[0]) => ({
                        type: "RuleElement",
                        rule: {
                            key: "Note",
                            outcome: ["criticalSuccess"],
                            text: lkey(l),
                            title: lkey("tech.label"),
                            selector: ["{item|id}-damage"],
                        },
                    }),
                ),
                {
                    levelMin: 12,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-12-resistance"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
                {
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-16-hazardous"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
            ],
        },
    ];
}
