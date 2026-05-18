import { lkeygen } from "@src/utils";
import { MaterialData } from "../../material";
import * as R from "remeda";
import { helpers } from "@data/helpers";

export function createImbueBurningBarbs(): MaterialData {
    const lkey = lkeygen(
        "data.imbuement.elemental-storm.burning-barbs" as const,
    );

    const base: MaterialData = {
        type: "imbuement" as const,
        key: "imbue:burning-barbs",
        label: {
            type: "key",
            key: lkey("label"),
        },
        description: { type: "key", key: lkey("description") },
        itemPredicate: [{ gte: ["item:refinement:skill:intimidation", 1] }],
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
            description: {
                type: "key",
                key: lkey("flavor"),
            },
        },
    };
    return R.pipe(
        base,
        helpers.addGroup({
            labels: helpers.leveledLabels(
                [6, 10, 16],
                helpers.sequentialData(
                    {
                        frequency: lkey("header.frequency.per-day"),
                    },
                    { frequency: lkey("header.frequency.per-hour") },
                    {
                        frequency: lkey("header.frequency.per-10-minutes"),
                    },
                ),
                ({ frequency }) => ({
                    text: {
                        type: "key",
                        key: lkey("header.activation"),
                        parameters: {
                            frequency: { type: "key", key: frequency },
                        },
                    },
                    sort: 1,
                }),
            ),
            effects: [
                {
                    levelMin: 6,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        selector: "skill-check",
                        predicate: [
                            "action:demoralize",
                            "burning-barbs-activation",
                        ],
                        outcome: ["success"],
                        title: lkey("label"),
                        text: {
                            type: "key",
                            key: lkey("effects.activation-note-success"),
                            parameters: {
                                damage: {
                                    type: "resolve",
                                    value: "ternary(gte(@material.level, 20), @item.level *2, ternary(gte(@material.level, 14), floor(@item.level *1.5), @item.level))",
                                },
                            },
                        },
                    },
                },
                {
                    levelMin: 6,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        selector: "skill-check",
                        predicate: [
                            "action:demoralize",
                            "burning-barbs-activation",
                        ],
                        outcome: ["criticalSuccess"],
                        title: lkey("label"),
                        text: {
                            type: "key",
                            key: lkey(
                                "effects.activation-note-critical-success",
                            ),
                            parameters: {
                                damage: {
                                    type: "resolve",
                                    value: "ternary(gte(@material.level, 20), @item.level *4, ternary(gte(@material.level, 14), @item.level *3,@item.level *2))",
                                },
                            },
                        },
                    },
                },
            ],
        }),
        helpers.addEffects({
            levelMin: 6,
            type: "RuleElement",
            rule: {
                key: "RollOption",
                option: "burning-barbs-activation",
                toggleable: true,
                value: false,
                label: lkey("effects.roll-option-toggle"),
            },
        }),
        helpers.addGroup({
            labels: {
                levelMin: 12,
                text: {
                    type: "key",
                    key: lkey("header.critical"),
                },
                sort: 2,
            },
            effects: {
                levelMin: 12,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    selector: "skill-check",
                    predicate: [
                        "action:demoralize",
                        { not: "burning-barbs-activation" },
                    ],
                    outcome: ["criticalSuccess"],
                    title: lkey("label"),
                    text: {
                        type: "key",
                        key: lkey("effects.note-critical"),
                        parameters: {
                            damage: {
                                type: "resolve",
                                value: "ternary(gte(@material.level, 18), @item.level, floor(@item.level /2))",
                            },
                        },
                    },
                },
            },
        }),
    );
}
