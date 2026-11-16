import { lkeygen } from "@src/utils";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";
import { helpers, Selector, selfAlteration } from "../../helpers";
import { Spells } from "@data/spells";
import { pipe } from "remeda";

export function createImbueSpirit(): MaterialData[] {
    const lkey = lkeygen("data.imbuement.elemental-storm.spirit" as const);
    const damageType = "spirit";

    const base = {
        type: "imbuement" as const,
        itemPredicate: ["item:type:weapon"],
        // The monster must have the spirit trait or an ability or spell that deals spirit damage.
        monsterPredicate: [
            {
                or: [
                    "self:trait:fire",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:melee",
                                    "item:type:spell",
                                ],
                            },
                            "item:damage:type:fire",
                        ],
                    },
                ],
            },
        ],
    };

    const magic = pipe(
        {
            ...base,
            key: "imbue:spirit:magic",
            label: { type: "key", key: lkey("magic.label") },
            description: { type: "key", key: lkey("magic.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [6, 14, 18],
                ["1", "d4", "d6"],
                (damage: RollString) =>
                    helpers.damage.label({
                        type: damageType,
                        value: damage,
                    }),
            ),
            effects: helpers.leveledEffects(
                [6, 14, 18],
                ["1", "d4", "d6"],
                (damage: RollString) =>
                    helpers.damage.effect({
                        type: damageType,
                        value: damage,
                        label: lkey("magic.label"),
                    }),
            ),
        }),

        helpers.addCantrip(Spells.DivineLance, { sort: 2 }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
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
            effects: [
                ...helpers.leveledEffects([4, 6, 8, 16], [1, 2, 3, 5], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.SpiritLink,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([6, 12, 16], [2, 4], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.SpiritualArmament,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([12, 16], [5, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.SpiritualGuardian,
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 16,
                    ...helpers.spellActivation({
                        uuid: Spells.SpiritBlast,
                        max: 1,
                        rank: 6,
                    }),
                },
            ],
        }),

        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: {
                    type: "key",
                    key: lkey("magic.header.level-20-spirit-song"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 20,
                ...helpers.spellActivation({
                    uuid: Spells.SpiritSong,
                    max: 1,
                    rank: 9,
                }),
            },
        }),
    );

    const might = pipe(
        {
            ...base,
            key: "imbue:spirit:might",
            label: { type: "key", key: lkey("might.label") },
            description: { type: "key", key: lkey("might.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [6, 8, 14],
                ["1", "d4", "d6"],
                (damage: RollString) =>
                    helpers.damage.label({
                        type: damageType,
                        value: damage,
                    }),
            ),
            effects: helpers.leveledEffects(
                [6, 8, 14],
                ["1", "d4", "d6"],
                (damage: RollString) =>
                    helpers.damage.effect({
                        type: damageType,
                        value: damage,
                        label: lkey("might.label"),
                    }),
            ),
        }),

        helpers.addGroup({
            labels: {
                levelMin: 4,
                text: {
                    type: "key",
                    key: lkey("might.header.level-4-ghost-touch"),
                },
                sort: 1,
            },
            effects: {
                levelMin: 4,
                ...selfAlteration("property-runes", "ghost-touch", "add"),
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 8,
                text: {
                    type: "key",
                    key: lkey("might.header.level-8-possessed"),
                },
                sort: 2,
            },
            effects: [
                {
                    levelMin: 8,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("might.effects.level-8-possessed"),
                        title: lkey("might.label"),
                        selector: [Selector.ItemDamage],
                    },
                },
                {
                    levelMin: 8,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("might.effects.level-8-possessed-critical"),
                        title: lkey("might.label"),
                        selector: [Selector.ItemAttack],
                        outcome: ["criticalSuccess"],
                    },
                },
            ],
        }),

        helpers.addGroup({
            labels: {
                levelMin: 12,
                text: {
                    type: "key",
                    key: lkey("might.header.level-12-resistance"),
                },
                sort: 3,
            },
            effects: {
                levelMin: 12,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("might.effects.level-12-resistance"),
                    title: lkey("might.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 18,
                text: {
                    type: "key",
                    key: lkey("might.header.level-18-frightened"),
                },
                sort: 2,
            },
            effects: {
                levelMin: 18,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("might.effects.level-18-frightened"),
                    title: lkey("might.label"),
                    selector: [Selector.ItemAttack],
                    outcome: ["criticalSuccess"],
                },
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: {
                    type: "key",
                    key: lkey("might.header.level-20-weakness"),
                },
                sort: 5,
            },
            effects: {
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
        }),
    );

    const tech = pipe(
        {
            ...base,
            key: "imbue:spirit:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [6, 8, 14, 18],
                ["1", "d6", "d8", "d10"],
                (damage: RollString) =>
                    helpers.damage.label({
                        type: damageType,
                        category: "persistent",
                        value: damage,
                    }),
            ),
            effects: helpers.leveledEffects(
                [4, 8, 14, 18],
                ["1", "d6", "d8", "d10"],
                (damage: RollString) =>
                    helpers.damage.effect({
                        type: damageType,
                        category: "persistent",
                        value: damage,
                        label: lkey("tech.label"),
                    }),
            ),
        }),

        helpers.addGroup({
            labels: {
                levelMin: 4,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-4-ghost-touch"),
                },
                sort: 1,
            },
            effects: {
                levelMin: 4,
                ...selfAlteration("property-runes", "ghost-touch", "add"),
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 8,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-8-possessed-critical"),
                },
                sort: 2,
            },
            effects: {
                levelMin: 8,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-8-possessed-critical"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemAttack],
                    outcome: ["criticalSuccess"],
                },
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 12,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-12-resistance"),
                },
                sort: 3,
            },
            effects: {
                levelMin: 12,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-12-resistance"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 16,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-16-frightened"),
                },
                sort: 2,
            },
            effects: {
                levelMin: 18,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-16-frightened"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemAttack],
                    outcome: ["criticalSuccess"],
                },
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-20-quasi-corporeal"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 20,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-20-quasi-corporeal"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),
    );
    return [magic, might, tech];
}
