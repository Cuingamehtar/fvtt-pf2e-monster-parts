import { I18n, lkeygen } from "@src/utils";
import { MaterialData } from "../../material";
import * as R from "remeda";
import { helpers } from "@data/helpers";

export function createImbueFireShield(): MaterialData {
    const lkey = lkeygen("data.imbuement.elemental-storm.fire-shield" as const);

    const base: MaterialData = {
        type: "imbuement" as const,
        key: "imbue:fire-shield",
        label: I18n.key(lkey("label")),
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:shield"],
        // The creature must have the fire trait or have an ability or spell
        // with the fire trait or that deals fire damage.
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
                            {
                                or: [
                                    "item:damage:type:fire",
                                    "item:trait:fire",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
        header: {
            description: I18n.key(lkey("header.flavor")),
        },
    };

    return R.pipe(
        base,

        helpers.addGroup({
            labels: {
                levelMin: 4,
                text: I18n.key(lkey("header.level-4-shield-block"), {
                    resistance: I18n.resolve(
                        "@actor.flags.system.fireShieldImbuementResistance",
                        true,
                    ),
                }),
                sort: 1,
            },
            effects: {
                levelMin: 4,
                type: "RuleElement",
                rule: {
                    key: "ActiveEffectLike",
                    mode: "override",
                    path: "flags.system.fireShieldImbuementResistance",
                    value: "ternary(gte(@item.flags.pf2e-monster-parts.values.imbueFireShieldLevel, 20), 20, ternary(gte(@item.flags.pf2e-monster-parts.values.imbueFireShieldLevel, 14), 10, 5))",
                },
            },
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [6, 10, 16, 20],
                [
                    "header.level-6-fire-damage",
                    "header.level-10-fire-damage",
                    "header.level-16-fire-damage",
                    "header.level-20-fire-damage",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: I18n.key(lkey(key)),
                    sort: 2,
                }),
            ),
        }),

        helpers.addGroup({
            labels: {
                levelMin: 8,
                text: I18n.key(lkey("header.level-8-bonus"), {
                    bonus: I18n.resolve("min(@item.acBonus, 2)", true),
                }),
                sort: 3,
            },
            effects: {
                levelMin: 8,
                type: "RuleElement",
                rule: {
                    key: "FlatModifier",
                    selector: "saving-throw",
                    value: "min(@item.acBonus, 2)",
                    predicate: [
                        "self:shield:raised",
                        { or: ["item:trait:fire", "item:trait:cold"] },
                    ],
                    type: "circumstance",
                    label: lkey("label"),
                },
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 12,
                text: I18n.key(lkey("header.level-12-temperature")),
                sort: 4,
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 14,
                text: I18n.key(lkey("header.level-14-resistance"), {
                    resistance: I18n.resolve(
                        "@actor.flags.system.fireShieldImbuementResistance",
                        true,
                    ),
                }),
                sort: 5,
            },
            effects: [
                {
                    type: "RuleElement",
                    levelMin: 14,
                    rule: {
                        key: "Resistance",
                        value: "@actor.flags.system.fireShieldImbuementResistance",
                        type: "fire",
                        label: lkey("label"),
                    },
                },
                {
                    type: "RuleElement",
                    levelMin: 14,
                    rule: {
                        key: "Resistance",
                        value: "@actor.flags.system.fireShieldImbuementResistance",
                        type: "cold",
                        label: lkey("label"),
                    },
                },
            ],
        }),

        helpers.addGroup({
            labels: {
                levelMin: 18,
                text: I18n.key(lkey("header.level-18-aura"), {
                    halfResistance: I18n.resolve(
                        "floor(@actor.flags.system.fireShieldImbuementResistance /2)",
                        true,
                    ),
                }),
                sort: 5,
            },
            effects: {
                type: "RuleElement",
                levelMin: 18,
                rule: {
                    key: "Aura",
                    radius: 30,
                    label: lkey("label"),
                    effects: [
                        {
                            affects: "allies",
                            uuid: "Compendium.pf2e-monster-parts.activations-and-effects.Item.7lGhWrGQ8RSkFGMq",
                            includesSelf: false,
                        },
                    ],
                },
            },
        }),
    );
}
