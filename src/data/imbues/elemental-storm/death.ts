import { tkey } from "@src/utils";
import { helpers } from "../../helpers";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";

export function createImbueDeath(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.elemental-storm.death"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.elemental-storm.death.${k}`);
    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:psychopomp",
                    "self:trait:undead",
                    "self:trait:void",
                    {
                        or: [
                            {
                                and: [
                                    "item:type:melee",
                                    "item:damage:type:void",
                                ],
                            },
                            {
                                and: [
                                    "item:type:spell",
                                    "item:damage:type:void",
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
            key: "imbue:death:magic",
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
                                type: "void",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.mAMEt4FFbdqoRnkN]" as I18nString,
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
                                "magic.header.level-20-wails-of-the-damned",
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
                            type: "void",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
                ...helpers.cantripActivation({
                    uuid: "Compendium.pf2e.spells-srd.Item.mAMEt4FFbdqoRnkN", // Void Warp
                }),
                ...helpers.leveledEffects(
                    [4, 6, 8, 12, 16],
                    [1, 2, 3, 4, 6],
                    (rank) =>
                        helpers.spellActivation({
                            uuid: "Compendium.pf2e.spells-srd.Item.wdA52JJnsuQWeyqz", // Harm
                            max: 1,
                            rank,
                        }),
                ),
                ...helpers.leveledEffects([6, 8, 12, 16], [2, 3, 4], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.XFtO4BBI22Uox2QP", // Sudden Blight
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([12, 16], [4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.07xYlmGX32XtHGEt", // Vampiric Maiden
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 16,
                    ...helpers.spellActivation({
                        uuid: "Compendium.battlezoo-bestiary-es-pf2e.spells.Item.hJpXtpxUoKwQmJTr", // Raise the Reaper's Scythe
                        max: 1,
                        rank: 5,
                    }),
                },
                {
                    levelMin: 20,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.FEsuyf203wTNE2et", // Wails of the Damned
                        max: 1,
                        rank: 9,
                    }),
                },
            ],
        },
        {
            ...base,
            key: "imbue:death:might",
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
                                type: "void",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 10,
                        levelMax: 15,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-10-enfeebled"),
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
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("might.header.level-16-enfeebled"),
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
                            type: "void",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
                ...helpers.leveledEffects(
                    [10, 16],
                    [
                        "might.effects.level-10-enfeebled",
                        "might.effects.level-16-enfeebled",
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
            key: "imbue:death:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "void",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 10, 14, 18],
                        ["1", "d6", "d8", "d10"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "void",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 15,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-8-enfeebled"),
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
                            key: lkey("tech.header.level-16-enfeebled"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey(
                                "tech.header.level-20-enfeebled-duration",
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
                        type: "void",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 10, 14, 18],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "void",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 16],
                    [
                        "tech.effects.level-8-enfeebled",
                        "tech.effects.level-16-enfeebled",
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
                        text: lkey("tech.effects.level-20-enfeebled-duration"),
                        title: lkey("tech.label"),
                        selector: ["{item|id}-attack"],
                    },
                },
            ],
        },
    ];
}
