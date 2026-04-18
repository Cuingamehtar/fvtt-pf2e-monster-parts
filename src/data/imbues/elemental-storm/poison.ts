import { tkey } from "@src/utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "@localTypes/global";

export function createImbuePoison(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.elemental-storm.poison"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.elemental-storm.poison.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:acid",
                    "self:trait:poison",
                    {
                        and: [
                            {
                                or: [
                                    "item:damage:type:acid",
                                    "item:damage:type:poison",
                                ],
                            },
                            {
                                or: ["item:type:melee", "item:type:spell"],
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
            key: "imbue:poison:magic",
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
                                type: "poison",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.D7ZEhTNIDWDLC2J4]",
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
                            key: lkey("magic.header.level-20-toxify-blood"),
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
                            type: "poison",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
                {
                    levelMin: 10,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("acid-damage"),
                        title: lkey("magic.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
                ...helpers.cantripActivation({
                    uuid: "Compendium.pf2e.spells-srd.Item.D7ZEhTNIDWDLC2J4", // Puff of Poison
                }),
                {
                    levelMin: 4,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.DYdvMZ8G2LiSLVWw", // Spider Sting
                        max: 1,
                        rank: 1,
                    }),
                },
                ...helpers.leveledEffects(
                    [6, 8, 12, 16],
                    [2, 3, 4, 6],
                    (rank) =>
                        helpers.spellActivation({
                            uuid: "Compendium.pf2e.spells-srd.Item.1meVElIu1CEVYWkv", // Noxious Vapors
                            max: 1,
                            rank,
                        }),
                ),
                ...helpers.leveledEffects([8, 12, 16], [2, 4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.3VxVbZqIRvpKkg3O", // Fungal Infestation
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 20,
                    ...helpers.spellActivation({
                        uuid: "Compendium.battlezoo-bestiary-es-pf2e.spells.Item.FVwXmCx6xPQwAQYc", // Toxify Blood
                        max: 1,
                        rank: 9,
                    }),
                },
            ],
        },
        {
            ...base,
            key: "imbue:poison:might",
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
                                type: "poison",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-8-persistent"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-14-persistent"),
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
                            type: "poison",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 14],
                    ["1", "2"],
                    (diceNumber: RollString) => ({
                        type: "RuleElement",
                        rule: {
                            key: "DamageDice",
                            selector: "{item|_id}-damage",
                            damageType: "poison",
                            category: "persistent",
                            dieSize: "d10",
                            diceNumber,
                            label: lkey("might.label"),
                            critical: true,
                        },
                    }),
                ),
                {
                    levelMin: 4,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("acid-damage"),
                        title: lkey("magic.label"),
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
            key: "imbue:poison:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "poison",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 8, 14, 18],
                        ["1", "d6", "d8", "d10"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "poison",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-8-persistent"),
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
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-16-condition"),
                        },
                        sort: 3,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-20-drained"),
                        },
                        sort: 4,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 6,
                    ...helpers.damage.effect({
                        type: "poison",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 8, 14, 18],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "poison",
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
                        selector: "{item|_id}-damage",
                        damageType: "poison",
                        category: "persistent",
                        dieSize: "d10",
                        diceNumber: 1,
                        label: lkey("tech.label"),
                        critical: true,
                    },
                },
                {
                    levelMin: 4,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["success", "criticalSuccess"],
                        text: lkey("acid-damage"),
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
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-16-condition"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-damage"],
                    },
                },
                {
                    levelMin: 20,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("tech.effects.level-20-drained"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-attack"],
                    },
                },
            ],
        },
    ];
}
