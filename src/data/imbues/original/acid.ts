import { tkey } from "../../../utils";
import { MaterialData } from "../../material";
import { helpers } from "../../helpers";
import { RollString } from "../../../types";

export function createImbueAcid(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.acid.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:acid",
                    {
                        or: [
                            {
                                and: [
                                    "item:type:melee",
                                    "item:damage:type:acid",
                                ],
                            },
                            {
                                and: [
                                    "item:type:spell",
                                    "item:damage:type:acid",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const magic: MaterialData = {
        ...base,
        key: "imbue:acid:magic",
        label: {
            type: "key",
            key: lkey("magic.label"),
        },
        description: {
            type: "key",
            key: lkey("magic.description"),
        },
        header: {
            description: {
                type: "key",
                key: lkey("header-description"),
            },
            labels: [
                // damage
                ...helpers.leveledLabels(
                    [10, 14, 18],
                    ["1", "d4", "d6"],
                    (value: RollString) =>
                        helpers.damage.label({ type: "acid", value: value }),
                ),
                {
                    levelMin: 2,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                        parameters: {
                            spell: "@UUID[Compendium.pf2e.spells-srd.Item.gISYsBFby1TiXfBt]",
                        },
                    },
                    sort: 1,
                },
                {
                    levelMin: 4,
                    levelMax: 5,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.magic.header.level-4-spells",
                    },
                    sort: 2,
                },
                {
                    levelMin: 6,
                    levelMax: 7,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.magic.header.level-6-spells",
                    },
                    sort: 2,
                },
                {
                    levelMin: 8,
                    levelMax: 11,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.magic.header.level-8-spells",
                    },
                    sort: 2,
                },
                {
                    levelMin: 12,
                    levelMax: 15,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.magic.header.level-12-spells",
                    },
                    sort: 2,
                },
                {
                    levelMin: 16,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.magic.header.level-16-spells",
                    },
                    sort: 2,
                },
                {
                    levelMin: 20,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.magic.header.level-20-spell",
                    },
                    sort: 3,
                },
            ],
        },
        effects: [
            ...helpers.leveledEffects(
                [10, 14, 18],
                ["1", "d4", "d6"],
                (value: RollString) =>
                    helpers.damage.effect({
                        type: "acid",
                        value: value,
                        label: lkey("magic.label"),
                    }),
            ),
        ],
    };

    const might: MaterialData = {
        ...base,
        key: "imbue:acid:might",
        label: {
            type: "key",
            key: lkey("might.label"),
        },
        description: {
            type: "key",
            key: lkey("might.description"),
        },
        header: {
            description: {
                type: "key",
                key: lkey("header-description"),
            },
            labels: [
                // damage
                ...helpers.leveledLabels(
                    [4, 6, 8, 18],
                    ["1", "d4", "d6", "d8"],
                    (value: RollString) =>
                        helpers.damage.label({ type: "acid", value: value }),
                ),
                {
                    levelMin: 8,
                    levelMax: 13,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.might.header.level-8-armor",
                    },
                    sort: 1,
                },
                {
                    levelMin: 14,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.might.header.level-14-armor",
                    },
                    sort: 1,
                },
                {
                    levelMin: 12,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.might.header.level-12-resistance",
                    },
                    sort: 2,
                },
                {
                    levelMin: 20,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.might.header.level-20-weakness",
                    },
                    sort: 3,
                },
            ],
        },
        effects: [
            ...helpers.leveledEffects(
                [4, 6, 8, 18],
                [1, "d4", "d6", "d8"],
                (damage: RollString) => {
                    return helpers.damage.effect({
                        type: "acid",
                        value: damage,
                        label: "pf2e-monster-parts.damage.type.acid",
                    });
                },
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
    };

    const tech: MaterialData = {
        ...base,
        key: "imbue:acid:tech",
        label: {
            type: "key",
            key: lkey("tech.label"),
        },
        description: {
            type: "key",
            key: lkey("tech.description"),
        },
        header: {
            description: {
                type: "key",
                key: lkey("header-description"),
            },
            labels: [
                // damage
                {
                    ...helpers.damage.label({ type: "acid", value: 1 }),
                    levelMin: 6,
                },
                // persistent damage
                ...helpers.leveledLabels(
                    [4, 8, 14, 18],
                    ["1", "d6", "d8", "d10"],
                    (value: RollString) =>
                        helpers.damage.label({
                            type: "acid",
                            category: "persistent",
                            value: value,
                        }),
                ),
                {
                    levelMin: 8,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.tech.header.level-8-armor",
                    },
                    sort: 1,
                },
                {
                    levelMin: 12,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.tech.header.level-12-resistance",
                    },
                    sort: 2,
                },
                {
                    levelMin: 16,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.tech.header.level-16-persistent-resistance",
                    },
                    sort: 2,
                },
                {
                    levelMin: 20,
                    text: {
                        type: "key",
                        key: "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.acid.tech.header.level-20-drained",
                    },
                    sort: 3,
                },
            ],
        },
        effects: [
            {
                levelMin: 6,
                ...helpers.damage.effect({
                    type: "acid",
                    value: 1,
                    label: lkey("tech.label"),
                }),
            },

            ...helpers.leveledEffects(
                [4, 8, 14, 18],
                [1, "d6", "d8", "d10"],
                (damage: RollString) => {
                    return helpers.damage.effect({
                        type: "acid",
                        value: damage,
                        category: "persistent",
                        label: "pf2e-monster-parts.damage.type.acid",
                    });
                },
            ),
            {
                levelMin: 8,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["criticalSuccess"],
                    text: lkey("tech.effects.level-8-note"),
                    title: lkey("tech.label"),
                    selector: ["{item|id}-attack"],
                },
            },
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
                levelMin: 20,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["criticalSuccess"],
                    text: lkey("tech.effects.level-20-note"),
                    title: lkey("tech.label"),
                    selector: ["{item|id}-attack"],
                },
            },
        ],
    };
    return [magic, might, tech];
}
