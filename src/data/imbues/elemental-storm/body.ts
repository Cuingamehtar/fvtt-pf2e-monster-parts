import { tkey } from "@src/utils";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";
import { helpers } from "../../helpers";
import { PredicateStatement } from "foundry-pf2e";

export function createImbueBody(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.elemental-storm.body"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.elemental-storm.body.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:tag:handwraps-of-mighty-blows"],
        monsterPredicate: [
            {
                or: [
                    { gte: ["self:size", 4] },
                    {
                        and: [
                            { or: ["item:type:melee", "item:type:spell"] },
                            {
                                or: [
                                    "item:trait:morph",
                                    "item:trait:polymorph",
                                ],
                            },
                        ],
                    },
                ],
            },
        ] as PredicateStatement[],
    };
    return [
        {
            ...base,
            key: "imbue:body:magic",
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
                                type: "bludgeoning",
                                value: damage,
                                key: "pf2e-monster-parts.damage.unarmed-strikes",
                            }),
                    ),
                    {
                        levelMin: 10,
                        text: {
                            type: "key",
                            key: lkey("morph-trait"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.MPxbKoR54gkYkqLO]" as I18nString,
                            },
                        },
                        sort: 2,
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
                            sort: 3,
                        }),
                    ),
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("magic.header.level-12-weapon-storm"),
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
                            type: "bludgeoning",
                            value: damage,
                            label: lkey("magic.label"),
                            selector: "unarmed-damage",
                        }),
                ),
                ...helpers.cantripActivation({
                    uuid: "Compendium.pf2e.spells-srd.Item.MPxbKoR54gkYkqLO", // Gouging Claw
                }),
                {
                    levelMin: 4,
                    ...helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.aEM2cttJ2eYcLssW", // Fleet Step
                        max: 1,
                        rank: 1,
                    }),
                },
                ...helpers.leveledEffects([6, 12, 16], [2, 4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.wzctak6BxOW8xvFV", // Enlarge
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([8, 16, 20], [3, 5, 7], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.battlezoo-bestiary-es-pf2e.spells.Item.Xt8LGrPSYf7TPXqX", // Pummeling Shockwave
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([12, 20], [4, 9], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.8M03UxGXjYyDFAoy", // Weapon Storm
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([16, 16], [5, 7], (rank) =>
                    helpers.spellActivation({
                        uuid: "Compendium.pf2e.spells-srd.Item.ZLLY6ThJXCCrO0rL", // Wall of Flesh
                        max: 1,
                        rank,
                    }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:body:might",
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
                                type: "bludgeoning",
                                value: damage,
                                key: "pf2e-monster-parts.damage.unarmed-strikes",
                            }),
                    ),
                    {
                        levelMin: 4,
                        text: {
                            type: "key",
                            key: lkey("morph-trait"),
                        },
                        sort: 1,
                    },
                    ...helpers.leveledLabels(
                        [8, 14],
                        [
                            "might.header.level-8-weak-point",
                            "might.header.level-14-weak-point",
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
                            type: "bludgeoning",
                            value: damage,
                            label: lkey("might.label"),
                            selector: "unarmed-damage",
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 14],
                    [
                        "might.effects.level-8-weak-point",
                        "might.effects.level-14-weak-point",
                    ],
                    (l: Parameters<typeof lkey>[0]) => ({
                        type: "RuleElement",
                        rule: {
                            key: "Note",
                            outcome: ["criticalSuccess"],
                            text: lkey(l),
                            title: lkey("might.label"),
                            selector: ["unarmed-attack-roll"],
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
                        selector: ["unarmed-damage"],
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
                        selector: ["unarmed-attack-roll"],
                    },
                },
            ],
        },
        {
            ...base,
            key: "imbue:body:tech",
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
                            key: "pf2e-monster-parts.damage.unarmed-strikes",
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
                                key: "pf2e-monster-parts.damage.unarmed-strikes",
                            }),
                    ),
                    {
                        levelMin: 4,
                        text: {
                            type: "key",
                            key: lkey("morph-trait"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 8,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-8-weak-point"),
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
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-16-damage-penalty"),
                        },
                        sort: 4,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.header.level-20-reduced-reach"),
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
                        selector: "unarmed-damage",
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
                            selector: "unarmed-damage",
                        }),
                ),
                {
                    levelMin: 8,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("tech.effects.level-8-weak-point"),
                        title: lkey("tech.label"),
                        selector: ["unarmed-attack-roll"],
                    },
                },
                {
                    levelMin: 12,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-12-resistance"),
                        title: lkey("tech.label"),
                        selector: ["unarmed-damage"],
                    },
                },
                {
                    levelMin: 16,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-16-damage-penalty"),
                        title: lkey("tech.label"),
                        selector: ["unarmed-damage"],
                    },
                },
                {
                    levelMin: 20,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-20-reduced-reach"),
                        title: lkey("tech.label"),
                        selector: ["unarmed-damage"],
                    },
                },
            ],
        },
    ];
}
