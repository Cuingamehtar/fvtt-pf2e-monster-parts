import { lkeygen } from "@src/utils";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";
import { helpers, Selector } from "../../helpers";
import { Spells } from "@data/spells";
import { pipe } from "remeda";

export function createImbueSpace(): MaterialData[] {
    const lkey = lkeygen("data.imbuement.elemental-storm.space" as const);
    const damageType = "slashing";

    const base = {
        type: "imbuement" as const,
        itemPredicate: ["item:type:weapon"],
        // The monster must be associated with space or have an ability or spell with the
        // teleportation trait (monsters with the teleportation trait also work, but they
        // usually don’t have that trait).
        monsterPredicate: [
            {
                or: [
                    "self:trait:teleportation",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:spell",
                                    "item:type:melee",
                                ],
                            },
                            "item:trait:teleportation",
                        ],
                    },
                ],
            },
        ],
    };

    const magic = pipe(
        {
            ...base,
            key: "imbue:space:magic",
            label: { type: "key", key: lkey("magic.label") },
            description: { type: "key", key: lkey("magic.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [10, 14, 18],
                ["1", "d4", "d6"],
                (damage: RollString) =>
                    helpers.damage.label({
                        type: damageType,
                        value: damage,
                    }),
            ),
            effects: helpers.leveledEffects(
                [10, 14, 18],
                ["1", "d4", "d6"],
                (damage: RollString) =>
                    helpers.damage.effect({
                        type: damageType,
                        value: damage,
                        label: lkey("magic.label"),
                    }),
            ),
        }),

        helpers.addLabels({
            levelMin: 10,
            text: {
                type: "key",
                key: lkey("teleportation-trait"),
            },
            sort: 1,
        }),

        helpers.addCantrip(Spells.InternalDistortion, { sort: 2 }),

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
                ...helpers.leveledEffects([4, 8], [1, 3], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.ThoughtfulGift,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([6, 12, 16], [2, 4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.AgonizingRelocation,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([12, 16], [4, 5], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.Translocate,
                        max: 1,
                        rank,
                    }),
                ),
                {
                    levelMin: 16,
                    ...helpers.spellActivation({
                        uuid: Spells.CollectiveTransposition,
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
                    key: lkey("magic.header.level-20-natures-enmity"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 20,
                ...helpers.spellActivation({
                    uuid: Spells.BlackHole,
                    max: 1,
                    rank: 9,
                }),
            },
        }),
    );

    const might = pipe(
        {
            ...base,
            key: "imbue:space:might",
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

        helpers.addLabels({
            levelMin: 4,
            text: {
                type: "key",
                key: lkey("teleportation-trait"),
            },
            sort: 1,
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [8, 14],
                [
                    "might.header.level-8-teleport",
                    "might.header.level-14-teleport",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: { type: "key", key: lkey(key) },
                    sort: 2,
                }),
            ),
            effects: helpers.leveledEffects(
                [8, 14],
                [
                    "might.effects.level-8-teleport",
                    "might.effects.level-14-teleport",
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
            key: "imbue:space:tech",
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

        helpers.addLabels({
            levelMin: 4,
            text: {
                type: "key",
                key: lkey("teleportation-trait"),
            },
            sort: 1,
        }),

        helpers.addGroup({
            labels: {
                levelMin: 8,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-8-teleport"),
                },
                sort: 3,
            },
            effects: {
                levelMin: 8,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["criticalSuccess"],
                    text: lkey("tech.effects.level-8-teleport"),
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
                    key: lkey("tech.header.level-16-off-guard"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 16,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-16-off-guard"),
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
                    key: lkey("tech.header.level-20-hopping"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 20,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-20-hopping"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),
    );
    return [magic, might, tech];
}
