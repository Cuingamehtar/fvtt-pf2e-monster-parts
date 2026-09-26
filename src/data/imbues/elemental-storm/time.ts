import { lkeygen } from "@src/utils";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";
import { helpers, Selector } from "../../helpers";
import { Spells } from "@data/spells";
import { pipe } from "remeda";

export function createImbueTime(): MaterialData[] {
    const lkey = lkeygen("data.imbuement.elemental-storm.time" as const);
    const damageType = "bludgeoning";

    const base = {
        type: "imbuement" as const,
        itemPredicate: ["item:type:weapon"],
        // The monster must have the time trait (substituted for the original)
        monsterPredicate: ["self:trait:time"],
    };

    const magic = pipe(
        {
            ...base,
            key: "imbue:time:magic",
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

        helpers.addCantrip(Spells.ReverberatingPain, { sort: 2 }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [4, 8, 10, 12, 16],
                [
                    "magic.header.level-4-spells",
                    "magic.header.level-8-spells",
                    "magic.header.level-10-spells",
                    "magic.header.level-12-spells",
                    "magic.header.level-16-spells",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: { type: "key", key: lkey(key) },
                    sort: 3,
                }),
            ),
            effects: [
                ...helpers.leveledEffects([4, 12, 16], [1, 5], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.TimeSkip,
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 8,
                    ...helpers.spellActivation({
                        uuid: Spells.Haste,
                        max: 1,
                        rank: 3,
                    }),
                },
                ...helpers.leveledEffects([10, 16], [4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.CurseOfLostTime,
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 16,
                    ...helpers.spellActivation({
                        uuid: Spells.Slow,
                        max: 1,
                        rank: 6,
                    }),
                },
                {
                    levelMin: 16,
                    ...helpers.spellActivation({
                        uuid: Spells.WallOfTime,
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
                    key: lkey("magic.header.level-20-desynchronize"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 20,
                ...helpers.spellActivation({
                    uuid: Spells.Desynchronize,
                    max: 1,
                    rank: 9,
                }),
            },
        }),
    );

    const might = pipe(
        {
            ...base,
            key: "imbue:time:might",
            label: { type: "key", key: lkey("might.label") },
            description: { type: "key", key: lkey("might.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [4, 6, 8, 18],
                ["1", "d4", "d6", "d8"],
                (damage: RollString) =>
                    helpers.damage.label({
                        type: damageType,
                        value: damage,
                    }),
            ),
            effects: helpers.leveledEffects(
                [4, 6, 8, 18],
                ["1", "d4", "d6", "d8"],
                (damage: RollString) =>
                    helpers.damage.effect({
                        type: damageType,
                        value: damage,
                        label: lkey("might.label"),
                    }),
            ),
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [8, 14],
                [
                    "might.header.level-8-quickened",
                    "might.header.level-14-quickened",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: { type: "key", key: lkey(key) },
                    sort: 2,
                }),
            ),
            effects: helpers.leveledEffects(
                [8, 14],
                [
                    "might.effects.level-8-quickened",
                    "might.effects.level-14-quickened",
                ],
                (l: Parameters<typeof lkey>[0]) => ({
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey(l),
                        title: lkey("might.label"),
                        selector: [Selector.ItemAttack],
                    },
                }),
            ),
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
            key: "imbue:time:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },

        helpers.addGroup({
            labels: {
                levelMin: 6,
                ...helpers.damage.label({
                    type: damageType,
                    value: 1,
                }),
            },
            effects: {
                levelMin: 6,
                ...helpers.damage.effect({
                    type: damageType,
                    value: 1,
                    label: lkey("tech.label"),
                }),
            },
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [4, 8, 14, 18],
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
                levelMin: 8,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-8-quickened"),
                },
                sort: 3,
            },
            effects: {
                levelMin: 8,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["criticalSuccess"],
                    text: lkey("tech.effects.level-8-quickened"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemAttack],
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
                    key: lkey("tech.header.level-16-slowed"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 16,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-16-slowed"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),
        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-20-reaction"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 20,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-20-reaction"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),
    );
    return [magic, might, tech];
}
