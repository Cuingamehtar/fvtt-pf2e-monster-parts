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
            description: {
                type: "key",
                key: lkey("magic.description"),
            },
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
                            "magic.header.level-4-spells",
                            "magic.header.level-6-spells",
                            "magic.header.level-10-spells",
                            "magic.header.level-12-spells",
                            "magic.header.level-16-spells",
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
                            key: lkey("magic.header.level-20-polar-ray"),
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
            description: {
                type: "key",
                key: lkey("might.description"),
            },
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
                            key: lkey("might.header.level-8-slow"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-12-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-14-slow"),
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
                    [4, 6, 8, 18],
                    ["1", "d4", "d6", "d8"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "cold",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
                {
                    levelMin: 8,
                    levelMax: 13,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("might.effects.level-8-note"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-attack"],
                    },
                },
                {
                    levelMin: 14,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("might.effects.level-14-note"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-attack"],
                    },
                },
                {
                    levelMin: 12,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("might.effects.level-12-note"),
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
                        text: lkey("might.effects.level-20-note"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-attack"],
                    },
                },
            ],
        },
        {
            ...base,
            key: "imbue:cold:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: {
                type: "key",
                key: lkey("tech.description"),
            },
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
                        [6, 8, 14, 20],
                        [
                            "tech.header.level-6-slow",
                            "tech.header.level-8-slow",
                            "tech.header.level-14-slow",
                            "tech.header.level-20-slow",
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
                            key: lkey("tech.header.level-12-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-16-surface"),
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
                ...helpers.leveledEffects(
                    [6, 8, 14, 20],
                    [
                        "tech.effects.level-6-note",
                        "tech.effects.level-8-note",
                        "tech.effects.level-14-note",
                        "tech.effects.level-20-note",
                    ],
                    (key: Parameters<typeof lkey>[0]) => ({
                        type: "RuleElement",
                        rule: {
                            key: "Note",
                            outcome: ["success", "criticalSuccess"],
                            text: lkey(key),
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
                        text: lkey("tech.effects.level-12-note"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
                {
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("tech.effects.level-16-note"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-attack"],
                    },
                },
            ],
        },
    ];
}
