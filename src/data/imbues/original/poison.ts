import { t, tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { addDamage, levelRange } from "../../helpers";

export function createImbuePoison(): ImbueSource[] {
    return [
        {
            key: "imbue:poison:magic",
            type: "imbue",
            label: t("imbue.poison.label", {
                variant: t("imbue.variant.magic"),
            }),
            flavor: tkey("imbue.poison.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:poison",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:poison",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:poison",
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
                    [10, 13, 1],
                    [14, 17, "d4"],
                    [18, undefined, "d6"],
                ].map(([from, to, damage]) => {
                    return {
                        ...levelRange(from as number, to as number),
                        effects: addDamage({
                            type: "poison",
                            value: damage as number | `d${number}`,
                            label: t("imbue.poison.label", {
                                variant: t("imbue.variant.magic"),
                            }),
                        }),
                    };
                }),
                {
                    ...levelRange(2),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.add-cantrip"),
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.D7ZEhTNIDWDLC2J4]",
                            },
                        },
                    ],
                },
                {
                    ...levelRange(4, 5),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.magic.level-4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.magic.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.magic.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.magic.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.magic.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.magic.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:poison:might",
            type: "imbue",
            label: t("imbue.poison.label", {
                variant: t("imbue.variant.might"),
            }),
            flavor: tkey("imbue.poison.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:poison",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:poison",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:poison",
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
                    [18, undefined, "d8"],
                ].map(([from, to, damage]) => {
                    return {
                        ...levelRange(from as number, to as number),
                        effects: addDamage({
                            type: "poison",
                            value: damage as number | `d${number}`,
                            label: t("imbue.poison.label", {
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
                            text: tkey("imbue.poison.might.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.might.level-14"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.might.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.might.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:poison:tech",
            type: "imbue",
            label: t("imbue.poison.label", {
                variant: t("imbue.variant.tech"),
            }),
            flavor: tkey("imbue.poison.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:poison",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:poison",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:poison",
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
                        type: "poison",
                        value: 1,
                        label: t("imbue.poison.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                // persistent damage
                ...[
                    [4, 7, 1],
                    [8, 13, "d6"],
                    [14, 17, "d8"],
                    [18, undefined, "d10"],
                ].map(([from, to, damage]) => {
                    return {
                        ...levelRange(from as number, to as number),
                        effects: addDamage({
                            type: "poison",
                            value: damage as number | `d${number}`,
                            category: "persistent",
                            label: t("imbue.poison.label", {
                                variant: t("imbue.variant.magic"),
                            }),
                        }),
                    };
                }),
                {
                    ...levelRange(8),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.tech.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.tech.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.tech.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.poison.tech.level-20"),
                        },
                    ],
                },
            ],
        },
    ];
}
