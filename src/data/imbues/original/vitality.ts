import { t, tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { addDamage, levelRange } from "../../helpers";

export function createImbueVitality(): ImbueSource[] {
    return [
        {
            key: "imbue:vitality:magic",
            type: "imbue",
            label: t("imbue.vitality.label", {
                variant: t("imbue.variant.magic"),
            }),
            flavor: tkey("imbue.vitality.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:vitality",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:vitality",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:vitality",
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
                            type: "vitality",
                            value: damage as number | `d${number}`,
                            label: t("imbue.vitality.label", {
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
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.kcelf6IHl3L9VXXg]",
                            },
                        },
                    ],
                },
                {
                    ...levelRange(4, 5),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.magic.level-4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.magic.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.magic.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.magic.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16, 19),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.magic.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.magic.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:vitality:might",
            type: "imbue",
            label: t("imbue.vitality.label", {
                variant: t("imbue.variant.might"),
            }),
            flavor: tkey("imbue.vitality.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:vitality",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:vitality",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:vitality",
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
                    [2, 3, 1],
                    [4, 5, "d4"],
                    [6, 17, "d6"],
                    [18, undefined, "d8"],
                ].map(([from, to, damage]) => {
                    return {
                        ...levelRange(from as number, to as number),
                        effects: addDamage({
                            type: "vitality",
                            value: damage as number | `d${number}`,
                            label: t("imbue.vitality.label", {
                                variant: t("imbue.variant.magic"),
                            }),
                        }),
                    };
                }),
                {
                    ...levelRange(6, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.might.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.might.level-14"),
                        },
                    ],
                },
                {
                    ...levelRange(10),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.might.level-10"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.might.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:vitality:tech",
            type: "imbue",
            label: t("imbue.vitality.label", {
                variant: t("imbue.variant.tech"),
            }),
            flavor: tkey("imbue.vitality.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:vitality",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:vitality",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:vitality",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            effects: [
                {
                    ...levelRange(4),
                    effects: addDamage({
                        type: "vitality",
                        value: 1,
                        label: t("imbue.vitality.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                // persistent damage
                ...[
                    [2, 5, 1],
                    [6, 11, "d6"],
                    [12, 17, "d8"],
                    [18, undefined, "d10"],
                ].map(([from, to, damage]) => {
                    return {
                        ...levelRange(from as number, to as number),
                        effects: addDamage({
                            type: "vitality",
                            value: damage as number | `d${number}`,
                            category: "persistent",
                            label: t("imbue.vitality.label", {
                                variant: t("imbue.variant.magic"),
                            }),
                        }),
                    };
                }),
                {
                    ...levelRange(6, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.tech.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(10),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.tech.level-10"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.tech.level-14"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.vitality.tech.level-20"),
                        },
                    ],
                },
            ],
        },
    ];
}
