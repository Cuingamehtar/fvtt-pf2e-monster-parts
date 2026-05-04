import { tkey } from "@src/utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "@localTypes/global";

export function createImbueMind(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.elemental-storm.mind"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.elemental-storm.mind.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:astral",
                    "self:trait:mental",
                    {
                        and: [
                            {
                                or: ["item:trait:astral", "item:trait:mental"],
                            },
                            {
                                or: ["item:type:spell", "item:type:melee"],
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
            key: "imbue:mind:magic",
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
                                type: "mental",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.4gBIw4IDrSfFHik4]",
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
                            key: lkey("magic.header.level-20-phantasmagoria"),
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
                            type: "mental",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
                ...helpers.cantripActivation({
                    uuid: "Compendium.pf2e.spells-srd.Item.4gBIw4IDrSfFHik4", // Daze
                }),
                ...helpers.leveledEffects(
                    [4, 6, 8, 12, 16],
                    [1, 2, 3, 4],
                    (rank) =>
                        helpers.spellActivation({
                            uuid: "Compendium.pf2e.spells-srd.Item.R8bqnYiThB6MYTxD", // Phantom Pain
                            max: 1,
                            rank,
                        }),
                ),
                ...helpers.leveledEffects([6, 16], [2, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.Mkbq9xlAUxHUHyR2", // Paranoia
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([12, 16], [4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.Jmxru8zMdYMRuO5n", // Vision of Death
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 16,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.0XP2XOxT9VSiXFDr", // Phantasmal Calamity
                        max: 1,
                        rank: 6,
                    }),
                },
                {
                    levelMin: 20,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.MJx7DmjsWYzDZ3a4", // Phantasmagoria
                        max: 1,
                        rank: 9,
                    }),
                },
            ],
        },
        {
            ...base,
            key: "imbue:mind:might",
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
                                type: "mental",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 10,
                        levelMax: 15,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-10-stupefied"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-16-stupefied"),
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
                            type: "mental",
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
                        text: lkey("might.effects.level-10-stupefied"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-attack"],
                        type: "key",
                    },
                },
                {
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("might.effects.level-16-stupefied"),
                        title: lkey("might.label"),
                        selector: ["{item|id}-attack"],
                        type: "key",
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
            key: "imbue:mind:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "mental",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 10],
                        ["1", "d6"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "mental",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 15,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-8-stupefied"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-16-stupefied"),
                        },
                        sort: 1,
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
                            key: lkey(
                                "tech.header.level-20-stupefied-duration",
                            ),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 6,
                    ...helpers.damage.effect({
                        type: "mental",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 10],
                    ["1", "d6"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "mental",
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
                        text: lkey("tech.effects.level-8-stupefied"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-attack"],
                        type: "key",
                    },
                },
                {
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("tech.effects.level-16-stupefied"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-attack"],
                        type: "key",
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
                        text: lkey("tech.effects.level-20-stupefied-duration"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
            ],
        },
    ];
}
