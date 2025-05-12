import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueAcid(): ImbueSource[] {
    const imbues: ImbueSource[] = [
        {
            key: "imbue:acid:magic",
            type: "imbue",
            label: t("Imbue.Acid.Label", { variant: t("Imbue.Variant.Magic") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [{
                or: ["self:trait:acid", {
                    or: [
                        { and: ["item:type:melee", "melee:damage:type:acid"] },
                        { and: ["item:type:spell", "spell:damage:type:acid"] }]
                }
                ]
            }],
            effects: [
                {
                    ...levelRange(10, 13),
                    effects: addDamage({
                        type: "acid",
                        value: 1,
                        label: tkey("Imbue.Acid.Magic.Label"),
                    })
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "acid",
                        value: "d4",
                        label: tkey("Imbue.Acid.Magic.Label"),
                    })
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "acid",
                        value: "d6",
                        label: tkey("Imbue.Acid.Magic.Label"),
                    })
                },
                {
                    ...levelRange(2),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.AddCantrip"),
                        parameters: { spell: "@UUID[Compendium.pf2e.spells-srd.Item.gISYsBFby1TiXfBt]" }
                    }]
                },
                {
                    ...levelRange(4, 5),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Magic.Level4")
                    }]
                },
                {
                    ...levelRange(6, 7),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Magic.Level6")
                    }]
                },
                {
                    ...levelRange(8, 11),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Magic.Level8")
                    }]
                },
                {
                    ...levelRange(12, 15),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Magic.Level12")
                    }]
                },
                {
                    ...levelRange(16),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Magic.Level16")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Magic.Level20")
                    }]
                }
            ]
        },
        {
            key: "imbue:acid:might",
            type: "imbue",
            label: t("Imbue.Acid.Label", { variant: t("Imbue.Variant.Might") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [{
                or: ["self:trait:acid", {
                    or: [
                        { and: ["item:type:melee", "melee:damage:type:acid"] },
                        { and: ["item:type:spell", "spell:damage:type:acid"] }]
                }
                ]
            }],
            effects: [
                {
                    ...levelRange(4, 5),
                    effects: addDamage({
                        type: "acid",
                        value: 1,
                        label: tkey("Imbue.Acid.Might.Label"),
                    })
                },
                {
                    ...levelRange(6, 7),
                    effects: addDamage({
                        type: "acid",
                        value: "d4",
                        label: tkey("Imbue.Acid.Might.Label"),
                    })
                },
                {
                    ...levelRange(8, 17),
                    effects: addDamage({
                        type: "acid",
                        value: "d6",
                        label: tkey("Imbue.Acid.Might.Label"),
                    })
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "acid",
                        value: "d8",
                        label: tkey("Imbue.Acid.Might.Label"),
                    })
                },
                {
                    ...levelRange(8, 13),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Might.Level8")
                    }]
                },
                {
                    ...levelRange(12),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Might.Level12")
                    }]
                },
                {
                    ...levelRange(14),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Might.Level14")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Might.Level20")
                    }]
                }
            ]
        },
        {
            key: "imbue:acid:tech",
            type: "imbue",
            label: t("Imbue.Acid.Label", { variant: t("Imbue.Variant.Tech") }),
            itemPredicate: ["item:type:weapon"],
            monsterPredicate: [{
                or: ["self:trait:acid", {
                    or: [
                        { and: ["item:type:melee", "melee:damage:type:acid"] },
                        { and: ["item:type:spell", "spell:damage:type:acid"] }]
                }
                ]
            }],
            effects: [
                {
                    ...levelRange(4, 7),
                    effects: addDamage({
                        type: "acid",
                        value: 1,
                        category: "persistent",
                        label: tkey("Imbue.Acid.Might.Label"),
                    })
                },
                {
                    ...levelRange(6),
                    effects: addDamage({
                        type: "acid",
                        value: 1,
                        label: tkey("Imbue.Acid.Tech.Label"),
                    })
                },
                {
                    ...levelRange(8, 13),
                    effects: addDamage({
                        type: "acid",
                        value: "d6",
                        category: "persistent",
                        label: tkey("Imbue.Acid.Tech.Label"),
                    })
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "acid",
                        value: "d8",
                        category: "persistent",
                        label: tkey("Imbue.Acid.Tech.Label"),
                    })
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "acid",
                        value: "d10",
                        category: "persistent",
                        label: tkey("Imbue.Acid.Tech.Label"),
                    })
                },
                {
                    ...levelRange(8),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Tech.Level8")
                    }]
                },
                {
                    ...levelRange(12),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Tech.Level12")
                    }]
                },
                {
                    ...levelRange(16),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Tech.Level16")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbue.Acid.Tech.Level20")
                    }]
                }
            ]
        }
    ]

    return imbues;
}