import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueFire(): ImbueSource[] {
    return [
        {
            key: "imbue:fire:magic",
            type: "imbue",
            label: t("imbue.fire.label", { variant: t("imbue.variant.magic") }),
            flavor: tkey("imbue.fire.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:fire",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:fire",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:fire",
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
                        type: "fire",
                        value: 1,
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "fire",
                        value: "d4",
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "fire",
                        value: "d6",
                        label: t("imbue.fire.label", {
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
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.6DfLZBl8wKIV03Iq]",
                            },
                        },
                    ],
                },
                {
                    ...levelRange(4, 5),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.magic.level-4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.magic.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.magic.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.magic.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.magic.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.magic.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:fire:might",
            type: "imbue",
            label: t("imbue.fire.label", { variant: t("imbue.variant.might") }),
            flavor: tkey("imbue.fire.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:fire",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:fire",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:fire",
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
                        type: "fire",
                        value: 1,
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "fire",
                        value: "d4",
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "fire",
                        value: "d6",
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "fire",
                        value: "d8",
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.might.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.might.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.might.level-14"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.might.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:fire:tech",
            type: "imbue",
            label: t("imbue.fire.label", { variant: t("imbue.variant.tech") }),
            flavor: tkey("imbue.fire.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:fire",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:fire",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:fire",
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
                        type: "fire",
                        value: 1,
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(4, 7),
                    effects: addDamage({
                        type: "fire",
                        value: 1,
                        category: "persistent",
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 13),
                    effects: addDamage({
                        type: "fire",
                        value: "d6",
                        category: "persistent",
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "fire",
                        value: "d8",
                        category: "persistent",
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "fire",
                        value: "d8",
                        category: "persistent",
                        label: t("imbue.fire.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(8),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.tech.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.tech.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.tech.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.fire.tech.level-20"),
                        },
                    ],
                },
            ],
        },
    ];
}
