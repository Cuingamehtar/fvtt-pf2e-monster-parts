import { ImbueSource, MaterialEffectSource } from "../../data-types";
import { i18nFormat, t, tkey } from "../../../utils";
import { levelRange } from "../../helpers";

export function createImbueEnergyResistant(): ImbueSource[] {
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
    return damageTypes.flatMap((type) => [
        {
            key: `imbue:energy-resistant:armor:${type}`,
            type: "imbue",
            label: t("imbue.energy-resistant.armor-label", {
                damage: i18nFormat(CONFIG.PF2E.damageTypes[type] as I18nKey),
            }),
            flavor: tkey("imbue.energy-resistant.armor-flavor"),
            itemPredicate: ["item:type:armor"],
            monsterPredicate: [
                {
                    or: [
                        { gt: [`self:resistance:${type}` as string, 0] },
                        `self:immunity:${type}`,
                    ],
                },
            ],
            effects: Array.fromRange(20, 1).map(
                (level): MaterialEffectSource => ({
                    ...levelRange(level, level),
                    effects: [
                        {
                            key: "RuleElement",
                            rule: {
                                key: "Resistance",
                                type: type,
                                value: level,
                            },
                        },
                        {
                            key: "InlineNote",
                            text: tkey("imbue.energy-resistant.armor-effect"),
                            parameters: { level },
                        },
                    ],
                }),
            ),
        },
        {
            key: `imbue:energy-resistant:shield:${type}`,
            type: "imbue",
            label: t("imbue.energy-resistant.shield-label", {
                damage: i18nFormat(CONFIG.PF2E.damageTypes[type] as I18nKey),
            }),
            flavor: tkey("imbue.energy-resistant.shield-flavor"),
            itemPredicate: ["item:type:shield"],
            monsterPredicate: [
                {
                    or: [
                        { gt: [`self:resistance:${type}` as string, 0] },
                        `self:immunity:${type}`,
                    ],
                },
            ],
            effects: Array.fromRange(20, 1).map(
                (level): MaterialEffectSource => ({
                    ...levelRange(level, level),
                    effects: [
                        {
                            key: "RuleElement",
                            rule: {
                                key: "Resistance",
                                type: type,
                                value: level,
                            },
                        },
                        {
                            key: "InlineNote",
                            text: tkey("imbue.energy-resistant.shield-effect"),
                            parameters: { level },
                        },
                    ],
                }),
            ),
        },
    ]);
}
