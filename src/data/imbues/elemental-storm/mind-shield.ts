import { I18n, lkeygen } from "@src/utils";
import { MaterialData } from "../../material";
import * as R from "remeda";
import { helpers } from "@data/helpers";

export function createImbueMindShield(): MaterialData {
    const lkey = lkeygen("data.imbuement.elemental-storm.mind-shield" as const);

    const base: MaterialData = {
        type: "imbuement" as const,
        key: "imbue:mind-shield",
        label: I18n.key(lkey("label")),
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:shield"],
        // The creature must have the astral or mental trait or have an attack, spell, or ability with the astral or mental traits.
        monsterPredicate: [
            {
                or: [
                    "self:trait:astral",
                    "self:trait:mental",
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
                                or: ["item:trait:astral", "item:trait:mental"],
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
                        "@actor.flags.system.mindShieldImbuementResistance",
                        true,
                    ),
                }),
                sort: 1,
            },
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [6, 10, 16],
                [
                    "header.level-6-mental-damage",
                    "header.level-10-mental-damage",
                    "header.level-16-mental-damage",
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
                    predicate: ["self:shield:raised", "item:trait:mental"],
                    type: "circumstance",
                    label: lkey("label"),
                },
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 12,
                text: I18n.key(lkey("header.level-12-thoughtsense")),
                sort: 4,
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 14,
                text: I18n.key(lkey("header.level-14-resistance"), {
                    resistance: I18n.resolve(
                        "@actor.flags.system.mindShieldImbuementResistance",
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
                        predicate: ["self:shield:raised"],
                        value: "@actor.flags.system.mindShieldImbuementResistance",
                        type: "mental",
                        label: lkey("label"),
                    },
                },
                {
                    levelMin: 14,
                    type: "RuleElement",
                    rule: {
                        key: "ActiveEffectLike",
                        mode: "override",
                        path: "flags.system.mindShieldImbuementResistance",
                        value: "ternary(gte(@item.flags.pf2e-monster-parts.values.imbueMindShieldLevel, 20), 20, 10)",
                    },
                },
            ],
        }),

        helpers.addGroup({
            labels: {
                levelMin: 18,
                text: I18n.key(lkey("header.level-18-aura"), {
                    halfResistance: I18n.resolve(
                        "floor(@actor.flags.system.mindShieldImbuementResistance /2)",
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
                            uuid: "Compendium.pf2e-monster-parts.activations-and-effects.Item.tA2cWMpOroeyb80v",
                            includesSelf: false,
                        },
                    ],
                },
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: I18n.key(lkey("header.level-20-counteract")),
                sort: 4,
            },
        }),
    );
}
