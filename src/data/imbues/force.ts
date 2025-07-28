import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueForce(): ImbueSource[] {
    return [
        {
            key: "imbue:force:magic",
            type: "imbue",
            label: t("Imbue.Force.Label", {
                variant: t("Imbue.Variant.Magic"),
            }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:force",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:force",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:force",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            effects: [
                {
                    ...levelRange(10, 13),
                    effects: addDamage({
                        type: "force",
                        value: 1,
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "force",
                        value: "d4",
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "force",
                        value: "d6",
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(2),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.AddCantrip"),
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.TVKNbcgTee19PXZR]",
                            },
                        },
                    ],
                },
                {
                    ...levelRange(4, 5),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Magic.Level4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Magic.Level6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Magic.Level8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Magic.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Magic.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Magic.Level20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:force:might",
            type: "imbue",
            label: t("Imbue.Force.Label", {
                variant: t("Imbue.Variant.Might"),
            }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:force",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:force",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:force",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            effects: [
                {
                    ...levelRange(4, 5),
                    effects: addDamage({
                        type: "force",
                        value: 1,
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "force",
                        value: "d4",
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "force",
                        value: "d6",
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "force",
                        value: "d8",
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(10, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Might.Level10"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Might.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Might.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Might.Level20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:force:tech",
            type: "imbue",
            label: t("Imbue.Force.Label", { variant: t("Imbue.Variant.Tech") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:force",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:force",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:force",
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
                        type: "force",
                        value: 1,
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(4, 9),
                    effects: addDamage({
                        type: "force",
                        value: 1,
                        category: "persistent",
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(10),
                    effects: addDamage({
                        type: "force",
                        value: "d6",
                        category: "persistent",
                        label: t("Imbue.Force.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(8),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Tech.Level8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Tech.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Tech.Level14"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Tech.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(18),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Tech.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Force.Tech.Level20"),
                        },
                    ],
                },
            ],
        },
    ];
}
