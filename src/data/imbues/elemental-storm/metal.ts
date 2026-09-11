import { lkeygen } from "@src/utils";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";
import { helpers, Selector } from "../../helpers";
import { Spells } from "@data/spells";
import { pipe } from "remeda";

export function createImbueMetal(): MaterialData[] {
    const lkey = lkeygen("data.imbuement.elemental-storm.metal" as const);

    const damageFunction = (
        damage: RollString,
        label: ReturnType<typeof lkey>,
    ) => [
        helpers.damage.effect({
            type: "bludgeoning",
            value: damage,
            predicate: ["item:damage:type:bludgeoning"],
            label,
            hideIfDisabled: true,
        }),
        helpers.damage.effect({
            type: "piercing",
            value: damage,
            predicate: ["item:damage:type:piercing"],
            label,
            hideIfDisabled: true,
        }),
        helpers.damage.effect({
            type: "slashing",
            value: damage,
            predicate: ["item:damage:type:slashing"],
            label,
            hideIfDisabled: true,
        }),
    ];

    const base = {
        type: "imbuement" as const,
        // Weapon (the weapon must be made of metal and must deal bludgeoning, piercing, or slashing damage)
        itemPredicate: [
            "item:type:weapon",
            {
                or: [
                    "item:damage:type:bludgeoning",
                    "item:damage:type:piercing",
                    "item:damage:type:slashing",
                ],
            },
        ],
        // The monster must have the metal trait or an ability or spell that
        // deals metal damage, or they must have a significant amount of metal in
        // their composition.
        monsterPredicate: [
            {
                or: [
                    "self:trait:metal",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:spell",
                                    "item:type:melee",
                                ],
                            },
                            "item:trait:metal",
                        ],
                    },
                ],
            },
        ],
    };

    const magic = pipe(
        {
            ...base,
            key: "imbue:metal:magic",
            label: { type: "key", key: lkey("magic.label") },
            description: { type: "key", key: lkey("magic.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [8, 14, 18],
                ["1", "1d4", "1d6"],
                (damage: RollString) => ({
                    text: {
                        type: "key",
                        key: lkey("damage"),
                        parameters: { damage },
                    },
                    sort: 3,
                }),
            ),
            effects: helpers.leveledEffects(
                [8, 14, 18],
                ["1", "d4", "d6"],
                (damage: RollString) =>
                    damageFunction(damage, lkey("magic.label")),
            ),
        }),

        helpers.addLabels({
            levelMin: 8,
            text: {
                type: "key",
                key: lkey("metal-trait"),
            },
            sort: 1,
        }),

        helpers.addCantrip(Spells.CascadingCaltrops, { sort: 2 }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [4, 6, 10, 12, 16],
                [
                    "magic.header.level-4-spells",
                    "magic.header.level-6-spells",
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
                ...helpers.leveledEffects([4, 12, 16], [1, 3, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.Buzzsaw,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([6, 10, 16], [2, 4, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.ReforgeWeapon,
                        max: 1,
                        rank,
                    }),
                ),
                ...helpers.leveledEffects([12, 16], [5, 6], (rank) =>
                    helpers.spellActivation({
                        uuid: Spells.ImpalingSpike,
                        max: 1,
                        rank,
                    }),
                ),
            ],
        }),

        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: {
                    type: "key",
                    key: lkey("magic.header.level-20-iron-deathtrap"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 20,
                ...helpers.spellActivation({
                    uuid: Spells.IronDeathtrap,
                    max: 1,
                    rank: 9,
                }),
            },
        }),
    );

    const might = pipe(
        {
            ...base,
            key: "imbue:metal:might",
            label: { type: "key", key: lkey("might.label") },
            description: { type: "key", key: lkey("might.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [4, 6, 8, 18],
                ["1", "1d4", "1d6", "1d8"],
                (damage: RollString) => ({
                    text: {
                        type: "key",
                        key: lkey("damage"),
                        parameters: { damage },
                    },
                    sort: 3,
                }),
            ),
            effects: helpers.leveledEffects(
                [4, 6, 8, 18],
                ["1", "d4", "d6", "d8"],
                (damage: RollString) =>
                    damageFunction(damage, lkey("might.label")),
            ),
        }),

        helpers.addLabels({
            levelMin: 4,
            text: {
                type: "key",
                key: lkey("metal-trait"),
            },
            sort: 1,
        }),

        helpers.addGroup({
            labels: {
                levelMin: 8,
                text: {
                    type: "key",
                    key: lkey("might.header.level-8-damage-type"),
                },
                sort: 2,
            },
            effects: {
                levelMin: 8,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["criticalSuccess"],
                    text: lkey("might.effects.level-8-damage-type"),
                    title: lkey("might.label"),
                    selector: [Selector.ItemAttack],
                },
            },
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
                levelMin: 14,
                text: {
                    type: "key",
                    key: lkey("might.header.level-14-material"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 14,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["criticalSuccess"],
                    text: lkey("might.effects.level-14-material"),
                    title: lkey("might.label"),
                    selector: [Selector.ItemAttack],
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
            key: "imbue:metal:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },

        helpers.addGroup({
            labels: {
                levelMin: 6,
                text: {
                    type: "key",
                    key: lkey("damage"),
                    parameters: { damage: "1" },
                },
                sort: 3,
            },
            effects: damageFunction("1", lkey("tech.label")).map((e) => ({
                levelMin: 6,
                ...e,
            })),
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [4, 8, 14, 18],
                ["1", "d6", "d8", "d10"],
                (damage: RollString) =>
                    helpers.damage.label({
                        type: "piercing",
                        category: "persistent",
                        value: damage,
                    }),
            ),
            effects: helpers.leveledEffects(
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
        }),

        helpers.addLabels({
            levelMin: 4,
            text: {
                type: "key",
                key: lkey("metal-trait"),
            },
            sort: 1,
        }),

        helpers.addGroup({
            labels: {
                levelMin: 8,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-8-effective"),
                },
                sort: 2,
            },
            effects: {
                levelMin: 8,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["criticalSuccess"],
                    text: lkey("tech.effects.level-8-effective"),
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
                    key: lkey("tech.header.level-16-material"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 16,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["criticalSuccess"],
                    text: lkey("tech.effects.level-16-material"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemAttack],
                },
            },
        }),
        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-20-dc"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 20,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-20-dc"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),
    );
    return [magic, might, tech];
}
