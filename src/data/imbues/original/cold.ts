import { t, tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { addDamage, levelRange } from "../../helpers";

export function createImbueCold(): ImbueSource[] {
    return [
        {
            key: "imbue:cold:magic",
            type: "imbue",
            label: t("imbue.cold.label", { variant: t("imbue.variant.magic") }),
            flavor: tkey("imbue.cold.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:cold",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:cold",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:cold",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            effects: [
                {
                    ...levelRange(8, 13),
                    effects: addDamage({
                        type: "cold",
                        value: 1,
                        label: t("imbue.cold.label", {
                            variant: t("imbue.variant.magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "cold",
                        value: "d4",
                        label: t("imbue.cold.label", {
                            variant: t("imbue.variant.magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "cold",
                        value: "d6",
                        label: t("imbue.cold.label", {
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
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.gYjPm7YwGtEa1oxh]",
                            },
                        },
                    ],
                },
                {
                    ...levelRange(4, 5),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.magic.level-4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.magic.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(10, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.magic.level-10"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.magic.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.magic.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.magic.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:cold:might",
            type: "imbue",
            label: t("imbue.cold.label", { variant: t("imbue.variant.might") }),
            flavor: tkey("imbue.cold.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:cold",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:cold",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:cold",
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
                        type: "cold",
                        value: 1,
                        label: t("imbue.cold.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "cold",
                        value: "d4",
                        label: t("imbue.cold.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "cold",
                        value: "d6",
                        label: t("imbue.cold.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "cold",
                        value: "d8",
                        label: t("imbue.cold.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.might.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.might.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.might.level-14"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.might.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:cold:tech",
            type: "imbue",
            label: t("imbue.cold.label", { variant: t("imbue.variant.tech") }),
            flavor: tkey("imbue.cold.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:cold",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:cold",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:cold",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            effects: [
                {
                    ...levelRange(4, 17),
                    effects: addDamage({
                        type: "cold",
                        value: 1,
                        category: "persistent",
                        label: t("imbue.cold.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "cold",
                        value: "d4",
                        category: "persistent",
                        label: t("imbue.cold.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.tech.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 19),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.tech.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.tech.level-20"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.tech.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.cold.tech.level-16"),
                        },
                    ],
                },
            ],
        },
    ];
}
