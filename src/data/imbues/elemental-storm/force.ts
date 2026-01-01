import { tkey } from "@src/utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "@localTypes/global";

export function createImbueForce(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.elemental-storm.force"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.elemental-storm.force.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:force",
                    {
                        or: [
                            {
                                and: [
                                    "item:type:melee",
                                    "item:damage:type:force",
                                ],
                            },
                            {
                                and: [
                                    "item:type:spell",
                                    "item:damage:type:force",
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
            key: "imbue:force:magic",
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
                                type: "force",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.TVKNbcgTee19PXZR]",
                            },
                        },
                        sort: 1,
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
                            sort: 2,
                        }),
                    ),
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey(
                                "magic.header.level-20-telekinetic-storm",
                            ),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [10, 14, 18],
                    ["1", "d4", "d6"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "force",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:force:might",
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
                                type: "force",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 10,
                        levelMax: 15,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-10-push"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-16-push"),
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
                            type: "force",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
                {
                    levelMin: 10,
                    levelMax: 15,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("might.effects.level-10-push"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
                {
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("might.effects.level-16-push"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
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
            key: "imbue:force:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "force",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 10],
                        ["1", "d6"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "force",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-8-push"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 14,
                        levelMax: 17,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-14-push"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 18,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-18-push"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-16-off-guard"),
                        },
                        sort: 2,
                    },
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
                            key: lkey("tech.header.level-20-prone"),
                        },
                        sort: 4,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 6,
                    ...helpers.damage.effect({
                        type: "force",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 10],
                    ["1", "d6"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "force",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 14, 18],
                    [
                        "tech.effects.level-8-push",
                        "tech.effects.level-14-push",
                        "tech.effects.level-18-push",
                    ],
                    (k: Parameters<typeof lkey>[0]) => ({
                        type: "RuleElement",
                        rule: {
                            key: "Note",
                            outcome: ["criticalSuccess"],
                            text: lkey(k),
                            title: lkey("tech.label"),
                            selector: ["{item|id}-damage"],
                        },
                    }),
                ),
                {
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("tech.effects.level-16-off-guard"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
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
            ],
        },
    ];
}
