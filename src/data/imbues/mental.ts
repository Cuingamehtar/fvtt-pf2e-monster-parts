import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueMental(): ImbueSource[] {
    return [
        {
            key: "imbue:mental:magic",
            type: "imbue",
            label: t("Imbue.Mental.Label", {
                variant: t("Imbue.Variant.Magic"),
            }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:mental",
                        "self:trait:astral",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:mental",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:mental",
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
                        type: "mental",
                        value: 1,
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "mental",
                        value: "d4",
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "mental",
                        value: "d6",
                        label: t("Imbue.Mental.Label", {
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
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.4gBIw4IDrSfFHik4]",
                            },
                        },
                    ],
                },
                {
                    ...levelRange(4, 5),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Magic.Level4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Magic.Level6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Magic.Level8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Magic.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Magic.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Magic.Level20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:mental:might",
            type: "imbue",
            label: t("Imbue.Mental.Label", {
                variant: t("Imbue.Variant.Might"),
            }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:mental",
                        "self:trait:astral",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:mental",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:mental",
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
                        type: "mental",
                        value: 1,
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "mental",
                        value: "d4",
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "mental",
                        value: "d6",
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "mental",
                        value: "d8",
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(10, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Might.Level10"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Might.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Might.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Might.Level20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:mental:tech",
            type: "imbue",
            label: t("Imbue.Mental.Label", {
                variant: t("Imbue.Variant.Tech"),
            }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:mental",
                        "self:trait:astral",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:mental",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:mental",
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
                        type: "mental",
                        value: 1,
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(4, 9),
                    effects: addDamage({
                        type: "mental",
                        value: 1,
                        category: "persistent",
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(10, 13),
                    effects: addDamage({
                        type: "mental",
                        value: "d6",
                        category: "persistent",
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "mental",
                        value: "d8",
                        category: "persistent",
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "mental",
                        value: "d10",
                        category: "persistent",
                        label: t("Imbue.Mental.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(8),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Tech.Level8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Tech.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Tech.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(18),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Tech.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Mental.Tech.Level20"),
                        },
                    ],
                },
            ],
        },
    ];
}
