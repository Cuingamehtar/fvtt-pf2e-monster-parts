import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueElectricity(): ImbueSource[] {
    const imbues: ImbueSource[] = [
        {
            key: "imbue:electricity:magic",
            type: "imbue",
            label: t("Imbue.Electricity.Label", { variant: t("Imbue.Variant.Magic") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [{
                or: ["self:trait:electricity", {
                    or: [
                        { and: ["item:type:melee", "melee:damage:type:electricity"] },
                        { and: ["item:type:spell", "spell:damage:type:electricity"] }]
                }
                ]
            }],
            effects: [
                {
                    ...levelRange(10, 13),
                    effects: addDamage({
                        type: "electricity",
                        value: 1,
                        label: tkey("Imbue.Electricity.Magic.Label"),
                    })
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "electricity",
                        value: "d4",
                        label: tkey("Imbue.Electricity.Magic.Label"),
                    })
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "electricity",
                        value: "d6",
                        label: tkey("Imbue.Electricity.Magic.Label"),
                    })
                },
                {
                    ...levelRange(2),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.AddCantrip"),
                        parameters: { spell: "@UUID[Compendium.pf2e.spells-srd.Item.kBhaPuzLUSwS6vVf]" }
                    }]
                },
                {
                    ...levelRange(4, 5),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Magic.Level4")
                    }]
                },
                {
                    ...levelRange(6, 15),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Magic.Level6")
                    }]
                },
                {
                    ...levelRange(8, 11),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Magic.Level8")
                    }]
                },
                {
                    ...levelRange(12, 15),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Magic.Level12")
                    }]
                },
                {
                    ...levelRange(16, 19),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Magic.Level16")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Magic.Level20")
                    }]
                }
            ]
        },
        {
            key: "imbue:electricity:might",
            type: "imbue",
            label: t("Imbue.Electricity.Label", { variant: t("Imbue.Variant.Might") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [{
                or: ["self:trait:electricity", {
                    or: [
                        { and: ["item:type:melee", "melee:damage:type:electricity"] },
                        { and: ["item:type:spell", "spell:damage:type:electricity"] }]
                }
                ]
            }],
            effects: [
                {
                    ...levelRange(4, 5),
                    effects: addDamage({
                        type: "electricity",
                        value: 1,
                        label: tkey("Imbue.Electricity.Might.Label"),
                    })
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "electricity",
                        value: "d4",
                        label: tkey("Imbue.Electricity.Might.Label"),
                    })
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "electricity",
                        value: "d6",
                        label: tkey("Imbue.Electricity.Might.Label"),
                    })
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "electricity",
                        value: "d8",
                        label: tkey("Imbue.Electricity.Might.Label"),
                    })
                },
                {
                    ...levelRange(8, 13),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Might.Level8")
                    }]
                },
                {
                    ...levelRange(12),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Might.Level12")
                    }]
                },
                {
                    ...levelRange(14),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Might.Level14")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Might.Level20")
                    }]
                }
            ]
        },
        {
            key: "imbue:electricity:tech",
            type: "imbue",
            label: t("Imbue.Electricity.Label", { variant: t("Imbue.Variant.Tech") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [{
                or: ["self:trait:electricity", {
                    or: [
                        { and: ["item:type:melee", "melee:damage:type:electricity"] },
                        { and: ["item:type:spell", "spell:damage:type:electricity"] }]
                }
                ]
            }],
            effects: [
                {
                    ...levelRange(6),
                    effects: addDamage({
                        type: "electricity",
                        value: 1,
                        label: tkey("Imbue.Electricity.Tech.Label"),
                    })
                },
                {
                    ...levelRange(4, 7),
                    effects: addDamage({
                        type: "electricity",
                        value: 1,
                        category: "persistent",
                        label: tkey("Imbue.Electricity.Tech.Label"),
                    })
                },
                {
                    ...levelRange(8,13),
                    effects: addDamage({
                        type: "electricity",
                        value: "d6",
                        category: "persistent",
                        label: tkey("Imbue.Electricity.Tech.Label"),
                    })
                },
                {
                    ...levelRange(14,17),
                    effects: addDamage({
                        type: "electricity",
                        value: "d8",
                        category: "persistent",
                        label: tkey("Imbue.Electricity.Tech.Label"),
                    })
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "electricity",
                        value: "d10",
                        category: "persistent",
                        label: tkey("Imbue.Electricity.Tech.Label"),
                    })
                },
                {
                    ...levelRange(12),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Tech.Level12")
                    }]
                },
                {
                    ...levelRange(8,15),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Tech.Level8")
                    }]
                },
                {
                    ...levelRange(16),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Tech.Level16")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Electricity.Tech.Level20")
                    }]
                }
            ]
        }
    ]

    return imbues;
}