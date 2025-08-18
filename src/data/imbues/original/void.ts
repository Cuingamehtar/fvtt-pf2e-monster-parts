import { t, tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { addDamage, levelRange } from "../../helpers";

export function createImbueVoid(): ImbueSource[] {
    return [
        {
            key: "imbue:void:magic",
            type: "imbue",
            label: t("imbue.void.label", {
                variant: t("imbue.variant.magic"),
            }),
            flavor: tkey("imbue.void.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:void",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:void",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:void",
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
                            type: "void",
                            value: damage as number | `d${number}`,
                            label: t("imbue.void.label", {
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
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.mAMEt4FFbdqoRnkN]",
                            },
                        },
                    ],
                },
                {
                    ...levelRange(4, 5),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.magic.level-4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.magic.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.magic.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.magic.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.magic.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.magic.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:void:might",
            type: "imbue",
            label: t("imbue.void.label", {
                variant: t("imbue.variant.might"),
            }),
            flavor: tkey("imbue.void.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:void",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:void",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:void",
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
                            type: "void",
                            value: damage as number | `d${number}`,
                            label: t("imbue.void.label", {
                                variant: t("imbue.variant.magic"),
                            }),
                        }),
                    };
                }),
                {
                    ...levelRange(10, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.might.level-10"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.might.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.might.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:void:tech",
            type: "imbue",
            label: t("imbue.void.label", {
                variant: t("imbue.variant.tech"),
            }),
            flavor: tkey("imbue.void.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:void",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:void",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:void",
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
                        type: "void",
                        value: 1,
                        label: t("imbue.void.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                // persistent damage
                ...[
                    [4, 9, 1],
                    [10, 13, "d6"],
                    [14, 17, "d8"],
                    [18, undefined, "d10"],
                ].map(([from, to, damage]) => {
                    return {
                        ...levelRange(from as number, to as number),
                        effects: addDamage({
                            type: "void",
                            value: damage as number | `d${number}`,
                            category: "persistent",
                            label: t("imbue.void.label", {
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
                            text: tkey("imbue.void.tech.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.tech.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.tech.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.void.tech.level-20"),
                        },
                    ],
                },
            ],
        },
    ];
}
