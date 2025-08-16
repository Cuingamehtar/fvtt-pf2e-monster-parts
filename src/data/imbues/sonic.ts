import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueSonic(): ImbueSource[] {
    return [
        {
            key: "imbue:sonic:might",
            type: "imbue",
            label: t("imbue.sonic.label", {
                variant: t("imbue.variant.might"),
            }),
            flavor: tkey("imbue.sonic.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:sonic",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:sonic",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:sonic",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            effects: [
                // Damage
                ...[
                    [4, 5, 1],
                    [6, 7, "d4"],
                    [8, 17, "d6"],
                    [18, undefined, "d6"],
                ].map(([from, to, damage]) => {
                    return {
                        ...levelRange(from as number, to as number),
                        effects: addDamage({
                            type: "sonic",
                            value: damage as number | `d${number}`,
                            label: t("imbue.sonic.label", {
                                variant: t("imbue.variant.magic"),
                            }),
                        }),
                    };
                }),
                {
                    ...levelRange(8, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.sonic.might.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.sonic.might.level-14"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.sonic.might.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.sonic.might.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:sonic:tech",
            type: "imbue",
            label: t("imbue.sonic.label", { variant: t("imbue.variant.tech") }),
            flavor: tkey("imbue.sonic.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:sonic",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:sonic",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:sonic",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            effects: [
                {
                    ...levelRange(6),
                    effects: addDamage({
                        type: "sonic",
                        value: 1,
                        label: t("imbue.sonic.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                // Persistent Damage
                ...[
                    [4, 7, 1],
                    [8, 13, "d6"],
                    [14, 17, "d8"],
                    [18, undefined, "d10"],
                ].map(([from, to, damage]) => {
                    return {
                        ...levelRange(from as number, to as number),
                        effects: addDamage({
                            type: "sonic",
                            value: damage as number | `d${number}`,
                            category: "persistent",
                            label: t("imbue.sonic.label", {
                                variant: t("imbue.variant.magic"),
                            }),
                        }),
                    };
                }),
                {
                    ...levelRange(8, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.sonic.tech.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.sonic.tech.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.sonic.tech.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.sonic.tech.level-20"),
                        },
                    ],
                },
            ],
        },
    ];
}
