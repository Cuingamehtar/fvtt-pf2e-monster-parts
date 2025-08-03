import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueElectricity(): ImbueSource[] {
    return [
        {
            key: "imbue:electricity:magic",
            type: "imbue",
            label: t("imbue.electricity.label", {
                variant: t("imbue.variant.magic"),
            }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:electricity",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:electricity",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:electricity",
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
                        type: "electricity",
                        value: 1,
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "electricity",
                        value: "d4",
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "electricity",
                        value: "d6",
                        label: t("imbue.electricity.label", {
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
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.kBhaPuzLUSwS6vVf]",
                            },
                        },
                    ],
                },
                {
                    ...levelRange(4, 5),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.magic.level-4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.magic.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.magic.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.magic.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16, 19),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.magic.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.magic.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:electricity:might",
            type: "imbue",
            label: t("imbue.electricity.label", {
                variant: t("imbue.variant.might"),
            }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:electricity",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:electricity",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:electricity",
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
                        type: "electricity",
                        value: 1,
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "electricity",
                        value: "d4",
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "electricity",
                        value: "d6",
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "electricity",
                        value: "d8",
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.might.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.might.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.might.level-14"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.might.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:electricity:tech",
            type: "imbue",
            label: t("imbue.electricity.label", {
                variant: t("imbue.variant.tech"),
            }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:electricity",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:electricity",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:electricity",
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
                        type: "electricity",
                        value: 1,
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(4, 7),
                    effects: addDamage({
                        type: "electricity",
                        value: 1,
                        category: "persistent",
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 13),
                    effects: addDamage({
                        type: "electricity",
                        value: "d6",
                        category: "persistent",
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "electricity",
                        value: "d8",
                        category: "persistent",
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "electricity",
                        value: "d10",
                        category: "persistent",
                        label: t("imbue.electricity.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.tech.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.tech.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.tech.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.electricity.tech.level-20"),
                        },
                    ],
                },
            ],
        },
    ];
}
