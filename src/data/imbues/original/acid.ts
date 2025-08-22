import { t, tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { addDamage, damageSeries, levelRange } from "../../helpers";

export function createImbueAcid(): ImbueSource[] {
    return [
        {
            key: "imbue:acid:magic",
            type: "imbue",
            label: t("imbue.acid.label", { variant: t("imbue.variant.magic") }),
            flavor: tkey("imbue.acid.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:acid",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:acid",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:acid",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            effects: [
                ...damageSeries([[10, 13], [14, 17], [18]], [1, "d4", "d6"], {
                    type: "acid",
                    label: t("imbue.acid.label", {
                        variant: t("imbue.variant.magic"),
                    }),
                }),
                {
                    ...levelRange(2),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.add-cantrip"),
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.gISYsBFby1TiXfBt]",
                            },
                        },
                    ],
                },
                {
                    ...levelRange(4, 5),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.magic.level-4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.magic.level-6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.magic.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.magic.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.magic.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.magic.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:acid:might",
            type: "imbue",
            label: t("imbue.acid.label", { variant: t("imbue.variant.might") }),
            flavor: tkey("imbue.acid.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:acid",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:acid",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:acid",
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            effects: [
                ...damageSeries(
                    [[4, 5], [6, 7], [8, 17], [20]],
                    [1, "d4", "d6", "d8"],
                    {
                        type: "acid",
                        label: t("imbue.acid.label", {
                            variant: t("imbue.variant.might"),
                        }),
                    },
                ),
                {
                    ...levelRange(8, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.might.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.might.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.might.level-14"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.might.level-20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:acid:tech",
            type: "imbue",
            label: t("imbue.acid.label", { variant: t("imbue.variant.tech") }),
            flavor: tkey("imbue.acid.flavor"),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [
                {
                    or: [
                        "self:trait:acid",
                        {
                            or: [
                                {
                                    and: [
                                        "item:type:melee",
                                        "melee:damage:type:acid",
                                    ],
                                },
                                {
                                    and: [
                                        "item:type:spell",
                                        "spell:damage:type:acid",
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
                        type: "acid",
                        value: 1,
                        label: t("imbue.acid.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    }),
                },
                ...damageSeries(
                    [[4, 7], [8, 13], [14, 17], [18]],
                    [1, "d6", "d8", "d10"],
                    {
                        type: "acid",
                        category: "persistent",
                        label: t("imbue.acid.label", {
                            variant: t("imbue.variant.tech"),
                        }),
                    },
                ),
                {
                    ...levelRange(8),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.tech.level-8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.tech.level-12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.tech.level-16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("imbue.acid.tech.level-20"),
                        },
                    ],
                },
            ],
        },
    ];
}
