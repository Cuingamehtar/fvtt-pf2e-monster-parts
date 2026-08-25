import { lkeygen } from "@src/utils";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";
import { helpers, Selector } from "../../helpers";
import { Spells } from "@data/spells";

export function createImbueEarth(): MaterialData[] {
    const lkey = lkeygen("data.imbuement.elemental-storm.earth" as const);

    const base = {
        type: "imbuement" as const,
        itemPredicate: ["item:type:weapon"],
        // The monster must have the earth trait or an ability or spell with
        // the earth trait
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
    };

    return [
        {
            ...base,
            key: "imbue:earth:magic",
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
                                type: "piercing",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: `@UUID[${Spells.ScatterScree}]`,
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
                            type: "piercing",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
                ...helpers.cantripActivation({
                    uuid: Spells.ScatterScree,
                }),
                ...helpers.leveledEffects([4, 6, 8, 12], [1, 2, 3], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.PummelingRubble,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([8, 12, 16], [3, 4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.Earthbind,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([12, 16], [4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.BoulderCrush,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([12, 16, 20], [4, 6, 8], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.MountainResilience,
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 20,
                    ...helpers.spellActivation({
                        uuid: Spells.Earthquake,
                        max: 1,
                        rank: 8,
                    }),
                },
            ],
        },
        {
            ...base,
            key: "imbue:earth:might",
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
                                type: "piercing",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 4,
                        text: {
                            type: "key",
                            key: lkey("earth-trait"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 8,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-8-difficult-terrain"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-14-damaging-shards"),
                        },
                        sort: 2,
                    },
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
                            type: "piercing",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 14],
                    ["1", "2"],
                    (dice: RollString) => ({
                        type: "RuleElement",
                        rule: {
                            key: "DamageDice",
                            selector: Selector.ItemDamage,
                            damageType: "piercing",
                            category: "persistent",
                            dieSize: "d10",
                            diceNumber: dice,
                            label: lkey("might.label"),
                            critical: true,
                        },
                    }),
                ),
                {
                    levelMin: 8,
                    levelMax: 13,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("might.effects.level-8-difficult-terrain"),
                        title: lkey("might.label"),
                        selector: [Selector.ItemAttack],
                    },
                },
                {
                    levelMin: 14,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("might.effects.level-14-difficult-terrain"),
                        title: lkey("might.label"),
                        selector: [Selector.ItemAttack],
                    },
                },
                {
                    levelMin: 12,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("might.effects.level-12-resistance"),
                        title: lkey("might.label"),
                        selector: [Selector.ItemDamage],
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
                        selector: [Selector.ItemAttack],
                    },
                },
            ],
        },
        {
            ...base,
            key: "imbue:earth:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "piercing",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 8, 14, 18],
                        ["1", "d6", "d8", "d10"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "piercing",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 4,
                        text: {
                            type: "key",
                            key: lkey("earth-trait"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 8,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-8-difficult-terrain"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-16-shield"),
                        },
                        sort: 3,
                    },
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-12-resistance"),
                        },
                        sort: 4,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-20-clumsy"),
                        },
                        sort: 5,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 6,
                    ...helpers.damage.effect({
                        type: "piercing",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 8, 14, 18],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "piercing",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
                {
                    levelMin: 8,
                    type: "RuleElement",
                    rule: {
                        key: "DamageDice",
                        selector: Selector.ItemDamage,
                        damageType: "piercing",
                        category: "persistent",
                        dieSize: "d10",
                        diceNumber: 1,
                        label: lkey("tech.label"),
                        critical: true,
                    },
                },
                {
                    levelMin: 8,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("tech.effects.level-8-difficult-terrain"),
                        title: lkey("tech.label"),
                        selector: [Selector.ItemAttack],
                    },
                },
                {
                    levelMin: 12,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-12-resistance"),
                        title: lkey("tech.label"),
                        selector: [Selector.ItemDamage],
                    },
                },
                {
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("tech.effects.level-16-shield"),
                        title: lkey("tech.label"),
                        selector: [Selector.ItemDamage],
                    },
                },
                {
                    levelMin: 20,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("tech.effects.level-20-clumsy"),
                        title: lkey("tech.label"),
                        selector: [Selector.ItemDamage],
                    },
                },
            ],
        },
    ];
}
