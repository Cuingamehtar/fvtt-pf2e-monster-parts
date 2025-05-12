import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueCold(): ImbueSource[] {
    const imbues: ImbueSource[] = [
        {
            key: "imbue:cold:magic",
            type: "imbue",
            label: t("Imbue.Cold.Label", { variant: t("Imbue.Variant.Magic") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [{
                or: ["self:trait:cold", {
                    or: [
                        { and: ["item:type:melee", "melee:damage:type:cold"] },
                        { and: ["item:type:spell", "spell:damage:type:cold"] }]
                }
                ]
            }],
            effects: [
                {
                    ...levelRange(8, 13),
                    effects: addDamage({
                        type: "cold",
                        value: 1,
                        label: tkey("Imbue.Cold.Magic.Label"),
                    })
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "cold",
                        value: "d4",
                        label: tkey("Imbue.Cold.Magic.Label"),
                    })
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "cold",
                        value: "d6",
                        label: tkey("Imbue.Cold.Magic.Label"),
                    })
                },
                {
                    ...levelRange(2),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.AddCantrip"),
                        parameters: { spell: "@UUID[Compendium.pf2e.spells-srd.Item.gYjPm7YwGtEa1oxh]" }
                    }]
                },
                {
                    ...levelRange(4, 5),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Magic.Level4")
                    }]
                },
                {
                    ...levelRange(6, 11),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Magic.Level6")
                    }]
                },
                {
                    ...levelRange(10, 15),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Magic.Level10")
                    }]
                },
                {
                    ...levelRange(12, 15),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Magic.Level12")
                    }]
                },
                {
                    ...levelRange(16),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Magic.Level16")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Magic.Level20")
                    }]
                }
            ]
        },
        {
            key: "imbue:cold:might",
            type: "imbue",
            label: t("Imbue.Cold.Label", { variant: t("Imbue.Variant.Might") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [{
                or: ["self:trait:cold", {
                    or: [
                        { and: ["item:type:melee", "melee:damage:type:cold"] },
                        { and: ["item:type:spell", "spell:damage:type:cold"] }]
                }
                ]
            }],
            effects: [
                {
                    ...levelRange(4, 5),
                    effects: addDamage({
                        type: "cold",
                        value: 1,
                        label: tkey("Imbue.Cold.Might.Label"),
                    })
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "cold",
                        value: "d4",
                        label: tkey("Imbue.Cold.Might.Label"),
                    })
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "cold",
                        value: "d6",
                        label: tkey("Imbue.Cold.Might.Label"),
                    })
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "cold",
                        value: "d8",
                        label: tkey("Imbue.Cold.Might.Label"),
                    })
                },
                {
                    ...levelRange(8, 13),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Might.Level8")
                    }]
                },
                {
                    ...levelRange(12),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Might.Level12")
                    }]
                },
                {
                    ...levelRange(14),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Might.Level14")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Might.Level20")
                    }]
                }
            ]
        },
        {
            key: "imbue:cold:tech",
            type: "imbue",
            label: t("Imbue.Cold.Label", { variant: t("Imbue.Variant.Tech") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [{
                or: ["self:trait:cold", {
                    or: [
                        { and: ["item:type:melee", "melee:damage:type:cold"] },
                        { and: ["item:type:spell", "spell:damage:type:cold"] }]
                }
                ]
            }],
            effects: [
                {
                    ...levelRange(4, 17),
                    effects: addDamage({
                        type: "cold",
                        value: 1,
                        category: "persistent",
                        label: tkey("Imbue.Cold.Might.Label"),
                    })
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "cold",
                        value: "d4",
                        category: "persistent",
                        label: tkey("Imbue.Cold.Tech.Label"),
                    })
                },
                {
                    ...levelRange(6,7),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Tech.Level6")
                    }]
                },
                {
                    ...levelRange(8,19),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Tech.Level8")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Tech.Level20")
                    }]
                },
                {
                    ...levelRange(12),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Tech.Level12")
                    }]
                },
                {
                    ...levelRange(16),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Cold.Tech.Level16")
                    }]
                }
            ]
        }
    ]

    return imbues;
}