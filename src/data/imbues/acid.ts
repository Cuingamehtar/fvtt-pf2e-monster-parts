import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamageDie, addFlatDamage, levelRange } from "../helpers";

export function createImbueAcid(): ImbueSource[] {
    const imbues: ImbueSource[] = [
        {
            key: "imbue:acid:magic",
            type: "imbue",
            label: tkey("Imbue.Acid.Magic"),
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
                    ...levelRange(2),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.AddCantrip"),
                        parameters: { spell: "@UUID[Compendium.pf2e.spells-srd.Item.gISYsBFby1TiXfBt]" }
                    }]
                },
                {
                    ...levelRange(4, 5),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Magic.Level4")
                    }]
                },
                {
                    ...levelRange(6, 7),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Magic.Level6")
                    }]
                },
                {
                    ...levelRange(8, 11),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Magic.Level8")
                    }]
                },
                {
                    ...levelRange(12, 15),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Magic.Level12")
                    }]
                },
                {
                    ...levelRange(16),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Magic.Level16")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Magic.Level20")
                    }]
                },
                {
                    ...levelRange(10, 13),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addFlatDamage({ type: "acid", label: tkey("Imbues.Acid.Magic.Label") })
                    }]
                },
                {
                    ...levelRange(14, 17),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d4",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", die: "d4", label: tkey("Imbues.Acid.Magic.Label") })
                    }]
                },
                {
                    ...levelRange(18),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d6",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", die: "d6", label: tkey("Imbues.Acid.Magic.Label") })
                    }]
                }
            ]
        },
        {
            key: "imbue:acid:might",
            type: "imbue",
            label: tkey("Imbue.Acid.Might"),
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
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addFlatDamage({ type: "acid", label: tkey("Imbues.Acid.Might.Label") })
                    }]
                },
                {
                    ...levelRange(6, 7),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d4",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", die: "d4", label: tkey("Imbues.Acid.Might.Label") })
                    }]
                },
                {
                    ...levelRange(8, 17),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d6",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", die: "d6", label: tkey("Imbues.Acid.Might.Label") })
                    }]
                },
                {
                    ...levelRange(18),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d8",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", die: "d8", label: tkey("Imbues.Acid.Might.Label") })
                    }]
                },
                {
                    ...levelRange(8, 13),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Might.Level8")
                    }]
                },
                {
                    ...levelRange(12),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Might.Level12")
                    }]
                },
                {
                    ...levelRange(14),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Might.Level14")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Might.Level20")
                    }]
                },
                {
                    ...levelRange(10, 13),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addFlatDamage({ type: "acid", label: tkey("Imbues.Acid.Magic.Label") })
                    }]
                },
                {
                    ...levelRange(14, 17),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d4",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", die: "d4", label: tkey("Imbues.Acid.Magic.Label") })
                    }]
                },
                {
                    ...levelRange(18),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d6",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", die: "d6", label: tkey("Imbues.Acid.Magic.Label") })
                    }]
                }
            ]
        },
        {
            key: "imbue:acid:tech",
            type: "imbue",
            label: tkey("Imbue.Acid.Tech"),
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
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Persistent"),
                        parameters: {
                            damage: "1",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addFlatDamage({ type: "acid", category: "persistent", label: tkey("Imbues.Acid.Might.Label") })
                    }]
                },
                {
                    ...levelRange(6),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addFlatDamage({ type: "acid", label: tkey("Imbues.Acid.Tech.Label") })
                    }]
                },
                {
                    ...levelRange(8, 13),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d6",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", category: "persistent", die: "d6", label: tkey("Imbues.Acid.Tech.Label") })
                    }]
                },
                {
                    ...levelRange(14, 17),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d8",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", category: "persistent", die: "d8", label: tkey("Imbues.Acid.Tech.Label") })
                    }]
                },
                {
                    ...levelRange(18),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Damage.Normal"),
                        parameters: {
                            damage: "1d10",
                            damageType: "acid"
                        }
                    },
                    {
                        key: "RuleElement",
                        rule: addDamageDie({ type: "acid", category: "persistent", die: "d10", label: tkey("Imbues.Acid.Tech.Label") })
                    }]
                },
                {
                    ...levelRange(8),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Tech.Level8")
                    }]
                },
                {
                    ...levelRange(12),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Tech.Level12")
                    }]
                },
                {
                    ...levelRange(16),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Tech.Level16")
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: tkey("Imbues.Acid.Tech.Level20")
                    }]
                }
            ]
        }
    ]

    return imbues;
}