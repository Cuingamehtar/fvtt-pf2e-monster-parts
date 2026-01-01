import { tkey } from "@src/utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "@localTypes/global";

export function createImbueSonic(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.sonic"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.sonic.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:sonic",
                    {
                        or: [
                            {
                                and: [
                                    "item:type:melee",
                                    "item:damage:type:sonic",
                                ],
                            },
                            {
                                and: [
                                    "item:type:spell",
                                    "item:damage:type:sonic",
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
            key: "imbue:sonic:might",
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
                                type: "sonic",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-8-deafened"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-14-deafened"),
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
                            type: "sonic",
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
                        text: lkey("might.effects.level-8-deafened"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
                {
                    levelMin: 14,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("might.effects.level-14-deafened"),
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
            key: "imbue:sonic:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("might.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "sonic",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 8, 14, 18],
                        ["1", "d6", "d8", "d10"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "sonic",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 15,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-8-deafened"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-16-deafened"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-12-resistance"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-20-boom"),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 6,
                    ...helpers.damage.effect({
                        type: "sonic",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 8, 14, 18],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "sonic",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
                {
                    levelMin: 8,
                    levelMax: 15,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("tech.effects.level-8-deafened"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
                {
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("tech.effects.level-16-deafened"),
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
                {
                    levelMin: 20,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("tech.effects.level-20-boom"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-attack"],
                    },
                },
            ],
        },
    ];
}
