import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueFire(): ImbueSource[] {
    const imbues: ImbueSource[] = [
        {
            key: "imbue:fire:magic",
            type: "imbue",
            label: t("Imbue.Fire.Label", { variant: t("Imbue.Variant.Magic") }),
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
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "fire",
                        value: "d4",
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "fire",
                        value: "d6",
                        label: t("Imbue.Fire.Label", {
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
                            text: tkey("Imbue.Fire.Magic.Level4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 7),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Magic.Level6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Magic.Level8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Magic.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Magic.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Magic.Level20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:fire:might",
            type: "imbue",
            label: t("Imbue.Fire.Label", { variant: t("Imbue.Variant.Might") }),
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
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "fire",
                        value: "d4",
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "fire",
                        value: "d6",
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "fire",
                        value: "d8",
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Might"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Might.Level8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Might.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Might.Level14"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Might.Level20"),
                        },
                    ],
                },
            ],
        },
        {
            key: "imbue:fire:tech",
            type: "imbue",
            label: t("Imbue.Fire.Label", { variant: t("Imbue.Variant.Tech") }),
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
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(4, 7),
                    effects: addDamage({
                        type: "fire",
                        value: 1,
                        category: "persistent",
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(8, 13),
                    effects: addDamage({
                        type: "fire",
                        value: "d6",
                        category: "persistent",
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "fire",
                        value: "d8",
                        category: "persistent",
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "fire",
                        value: "d8",
                        category: "persistent",
                        label: t("Imbue.Fire.Label", {
                            variant: t("Imbue.Variant.Tech"),
                        }),
                    }),
                },
                {
                    ...levelRange(8),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Tech.Level8"),
                        },
                    ],
                },
                {
                    ...levelRange(12),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Tech.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(16),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Tech.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Fire.Tech.Level20"),
                        },
                    ],
                },
            ],
        },
    ];

    return imbues;
}
