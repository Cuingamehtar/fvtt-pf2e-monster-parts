import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueMental(): ImbueSource[] {
    return [
        {
            key: "imbue:mental:magic",
            type: "imbue",
            label: t("imbue.mental.label", {
                variant: t("imbue.variant.magic"),
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
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "mental",
                        value: "d4",
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "mental",
                        value: "d6",
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(2),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.add-cantrip"),
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
                            text: tkey("imbue.mental.magic.level-4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.magic.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.magic.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.magic.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.magic.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.magic.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:mental:might",
            type: "imbue",
            label: t("imbue.mental.label", {
                variant: t("imbue.variant.might"),
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
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "mental",
                        value: "d4",
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "mental",
                        value: "d6",
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "mental",
                        value: "d8",
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(10, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.might.level-10"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.might.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.might.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.might.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:mental:tech",
            type: "imbue",
            label: t("imbue.mental.label", {
                variant: t("imbue.variant.tech"),
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
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(4, 9),
                    effects: addDamage({
                        type: "mental",
                        value: 1,
                        category: "persistent",
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(10, 13),
                    effects: addDamage({
                        type: "mental",
                        value: "d6",
                        category: "persistent",
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "mental",
                        value: "d8",
                        category: "persistent",
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "mental",
                        value: "d10",
                        category: "persistent",
                        label: t("imbue.mental.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(8),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.tech.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.tech.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.tech.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(18),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.tech.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.mental.tech.level-20"),
                        },
                    ],
                },
            ],
        },
    ];
}
