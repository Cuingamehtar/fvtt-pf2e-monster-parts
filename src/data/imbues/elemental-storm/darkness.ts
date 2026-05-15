import { lkeygen } from "@src/utils";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";
import { helpers } from "../../helpers";
import { Spells } from "@data/spells";

export function createImbueDarkness(): MaterialData[] {
    const lkey = lkeygen("data.imbuement.elemental-storm.darkness" as const);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        // The monster must have the darkness or shadow trait or an ability or spell with the darkness or shadow trait.
        monsterPredicate: [
            {
                or: [
                    "self:trait:darkness",
                    "self:trait:shadow",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:spell",
                                    "item:type:melee",
                                ],
                            },
                            {
                                or: [
                                    "item:trait:darkness",
                                    "item:trait:shadow",
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
            key: "imbue:dakness:magic",
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
                                type: "cold",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 10,
                        text: {
                            type: "key",
                            key: lkey("darkness-trait"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: lkey(
                                "magic.header.level-2-activation-counteract",
                            ),
                        },
                        sort: 2,
                    },
                    ...helpers.leveledLabels(
                        [4, 6, 8, 12, 16],
                        [
                            "magic.header.level-4-spells",
                            "magic.header.level-6-spells",
                            "magic.header.level-8-spells",
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
                            key: lkey("magic.header.level-20-eclipse-burst"),
                        },
                        sort: 4,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [10, 14, 18],
                    ["1", "d4", "d6"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "cold",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
                ...helpers.leveledEffects([4, 12, 16], [2, 4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.EyeBitingShadow,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([6, 12, 16], [2, 5, 7], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.4GE2ZdODgIQtg51c", // Darkness
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([8, 12, 16], [3, 4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.sRfSBHWHdbIa0aGc", // Chilling Darkness
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 4,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.0jadeyQIItIuRgeH", // Eclipse Burst
                        max: 1,
                        rank: 9,
                    }),
                },
            ],
        },
        {
            ...base,
            key: "imbue:darkness:might",
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
                                type: "cold",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 4,
                        text: {
                            type: "key",
                            key: lkey("darkness-trait"),
                        },
                        sort: 1,
                    },
                    ...helpers.leveledLabels(
                        [8, 14],
                        [
                            "might.header.level-8-concealed",
                            "might.header.level-14-concealed",
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
                            type: "cold",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 14],
                    [
                        "might.effects.level-8-concealed",
                        "might.effects.level-14-concealed",
                    ],
                    (l: Parameters<typeof lkey>[0]) => ({
                        type: "RuleElement",
                        rule: {
                            key: "Note",
                            outcome: ["criticalSuccess"],
                            text: lkey(l),
                            title: lkey("might.label"),
                            selector: ["{item|id}-attack"],
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
            key: "imbue:darkness:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "bludgeoning",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 8, 14, 18],
                        ["1", "d6", "d8", "d10"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "bludgeoning",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 4,
                        text: {
                            type: "key",
                            key: lkey("darkness-trait"),
                        },
                        sort: 1,
                    },
                    ...helpers.leveledLabels(
                        [8, 16],
                        [
                            "tech.header.level-8-concealed",
                            "tech.header.level-16-concealed",
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
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-20-counteract"),
                        },
                        sort: 4,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 6,
                    ...helpers.damage.effect({
                        type: "bludgeoning",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 8, 14, 18],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "bludgeoning",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 16],
                    [
                        "tech.effects.level-8-concealed",
                        "tech.effects.level-16-concealed",
                    ],
                    (l: Parameters<typeof lkey>[0]) => ({
                        type: "RuleElement",
                        rule: {
                            key: "Note",
                            outcome: ["criticalSuccess"],
                            text: lkey(l),
                            title: lkey("tech.label"),
                            selector: ["{item|id}-attack"],
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
                    levelMin: 20,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-20-counteract"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
            ],
        },
    ];
}
