import { tkey } from "../../../utils";
import { MaterialData } from "../../material";
import { Material } from "../../../material";

export function createImbueEnergyResistant(): MaterialData[] {
    const damageTypes: (keyof typeof CONFIG.PF2E.damageTypes)[] = [
        "acid",
        "cold",
        "electricity",
        "fire",
        "force",
        "sonic",
        "vitality",
        "void",
    ];
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.energy-resistant"
            >
        >,
    ): I18nKey =>
        tkey(`data.imbuement.battlezoo-bestiary.energy-resistant.${k}`);

    return damageTypes.flatMap((type) => {
        const damageLabel = CONFIG.PF2E.damageTypes[type] as I18nKey;
        return [
            {
                key: `imbue:energy-resistant:armor:${type}`,
                type: "imbuement",
                label: {
                    type: "key",
                    key: lkey("armor-label"),
                    parameters: {
                        damage: { type: "key", key: damageLabel },
                    },
                },
                itemPredicate: ["item:type:armor"],
                monsterPredicate: [
                    {
                        or: [
                            { gt: [`self:resistance:${type}` as string, 0] },
                            `self:immunity:${type}`,
                        ],
                    },
                ],
                header: {
                    description: { type: "key", key: lkey("armor-flavor") },
                    labels: [
                        {
                            levelMin: 1,
                            text: {
                                type: "key" as "key",
                                key: lkey("armor-effect"),
                                parameters: {
                                    level: {
                                        type: "resolve",
                                        value: Material.getRollDataPath(
                                            `imbue:energy-resistant:armor:${type}`,
                                            "level",
                                        ),
                                    },
                                },
                            },
                        },
                    ],
                },
                effects: [
                    {
                        type: "RuleElement" as "RuleElement",
                        levelMin: 1,
                        rule: {
                            key: "Resistance",
                            type: type,
                            value: Material.getRollDataPath(
                                `imbue:energy-resistant:armor:${type}`,
                                "level",
                            ),
                        },
                    },
                ],
            },
            {
                key: `imbue:energy-resistant:shield:${type}`,
                type: "imbuement",
                label: {
                    type: "key",
                    key: lkey("shield-label"),
                    parameters: {
                        damage: { type: "key", key: damageLabel },
                    },
                },
                itemPredicate: ["item:type:shield"],
                monsterPredicate: [
                    {
                        or: [
                            { gt: [`self:resistance:${type}` as string, 0] },
                            `self:immunity:${type}`,
                        ],
                    },
                ],
                header: {
                    description: { type: "key", key: lkey("shield-flavor") },
                    labels: [
                        {
                            levelMin: 1,
                            text: {
                                type: "key" as "key",
                                key: lkey("shield-effect"),
                                parameters: {
                                    level: {
                                        type: "resolve",
                                        value: Material.getRollDataPath(
                                            `imbue:energy-resistant:shield:${type}`,
                                            "level",
                                        ),
                                    },
                                },
                            },
                        },
                    ],
                },
                effects: [
                    {
                        type: "RuleElement" as "RuleElement",
                        levelMin: 1,
                        rule: {
                            key: "Resistance",
                            type: type,
                            value: Material.getRollDataPath(
                                `imbue:energy-resistant:shield:${type}`,
                                "level",
                            ),
                        },
                    },
                ],
            },
        ];
    });
}
