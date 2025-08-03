import { ImbueSource } from "../data-types";
import { t, tkey } from "../../utils";
import { addDamage, levelRange } from "../helpers";
import { DAMAGE_TYPES } from "foundry-pf2e";

export function createImbueEnergyResistant(): ImbueSource[] {
    const damageTypes = [
        "acid",
        "cold",
        "electricity",
        "fire",
        "force",
        "sonic",
        "vitality",
        "void",
    ];/*
    return damageTypes.map((type) => {
        return {
            key: `imbue:energy-resistant:armor:${type}`,
            type: "imbue",
            label: t("Imbue.EnergyResitant.Label", {
                // @ts-expect-error
                variant: t(`Damage.${type}`),
            }),
            flavor: t("Imbue.EnergyResistant.Flavor", {
                // @ts-expect-error
                type: t(`Damage.${type}`}
            ),
            itemPredicate: ["item:type:armor"],*/
            /*monsterPredicate: [
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
                        label: t("Imbue.Electricity.Label", {
                            variant: t("Imbue.Variant.Magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(14, 17),
                    effects: addDamage({
                        type: "electricity",
                        value: "d4",
                        label: t("Imbue.Electricity.Label", {
                            variant: t("Imbue.Variant.Magic"),
                        }),
                    }),
                },
                {
                    ...levelRange(18),
                    effects: addDamage({
                        type: "electricity",
                        value: "d6",
                        label: t("Imbue.Electricity.Label", {
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
                            text: tkey("Imbue.Electricity.Magic.Level4"),
                        },
                    ],
                },
                {
                    ...levelRange(6, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Electricity.Magic.Level6"),
                        },
                    ],
                },
                {
                    ...levelRange(8, 11),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Electricity.Magic.Level8"),
                        },
                    ],
                },
                {
                    ...levelRange(12, 15),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Electricity.Magic.Level12"),
                        },
                    ],
                },
                {
                    ...levelRange(16, 19),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Electricity.Magic.Level16"),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: tkey("Imbue.Electricity.Magic.Level20"),
                        },
                    ],
                },
            ],*/
        };
    });
}
