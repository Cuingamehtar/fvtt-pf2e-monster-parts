import { getConfig } from "../../../config";
import { i18nFormat, tkey } from "../../../utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { PredicateStatement } from "foundry-pf2e";
import { RollString } from "../../../types";

export function createImbueBane(): MaterialData[] {
    return getConfig().baneCreatureTraits.flatMap(baneImbue);
}

function baneImbue(creature: string): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.bane"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.bane.${k}`);

    const creatureLabel = i18nFormat({
        type: "key",
        key: CONFIG.PF2E.creatureTraits[
            creature as keyof typeof CONFIG.PF2E.creatureTraits
        ] as I18nKey,
    });

    const predicate = [`target:trait:${creature}`] as PredicateStatement[];
    const labelMight = i18nFormat({
        type: "key",
        key: lkey("might.label"),
        parameters: { creature: creatureLabel },
    });
    const labelTech = i18nFormat({
        type: "key",
        key: lkey("tech.label"),
        parameters: { creature: creatureLabel },
    });

    return [
        {
            key: `imbue:bane:${creature}:might`,
            type: "imbuement",
            label: labelMight,
            description: {
                type: "key",
                key: lkey("might.description"),
                parameters: { creature: creatureLabel },
            },
            monsterPredicate: [`self:trait:${creature}`],
            itemPredicate: ["item:type:weapon"],
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [2, 4, 6, 16, 20],
                        ["1", "d4", "d6", "d8", "d10"],
                        (damage) => ({
                            text: {
                                type: "key",
                                key: lkey("damage"),
                                parameters: {
                                    damage: damage,
                                    creature: creatureLabel,
                                },
                            },
                            sort: -5,
                        }),
                    ),
                    {
                        levelMin: 6,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("might.level-6-enfeebled"),
                            parameters: { creature: creatureLabel },
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 14,
                        text: {
                            type: "key",
                            key: lkey("might.level-14-enfeebled"),
                            parameters: { creature: creatureLabel },
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 10,
                        text: {
                            type: "key",
                            key: lkey("might.level-10-resistance"),
                            parameters: { creature: creatureLabel },
                        },
                        sort: 2,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [2, 4, 6, 16, 20],
                    ["1", "d4", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            value: damage,
                            label: labelMight,
                            predicate: predicate,
                        }),
                ),
                {
                    levelMin: 6,
                    levelMax: 13,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("effects.level-6-note"),
                        title: labelMight as string,
                        selector: ["{item|id}-attack"],
                    },
                },
                {
                    levelMin: 14,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("effects.level-14-note"),
                        title: labelMight as string,
                        selector: ["{item|id}-attack"],
                    },
                },
                {
                    levelMin: 10,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("might.effects.level-10-note"),
                        title: labelMight as string,
                        selector: ["{item|id}-damage"],
                    },
                },
            ],
        },
        {
            key: `imbue:bane:${creature}:tech`,
            type: "imbuement",
            label: labelTech,
            description: {
                type: "key",
                key: lkey("tech.description"),
                parameters: { creature: creatureLabel },
            },
            monsterPredicate: [`self:trait:${creature}`],
            itemPredicate: ["item:type:weapon"],
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 4,
                        text: {
                            type: "key",
                            key: lkey("damage"),
                            parameters: { damage: 1, creature: creatureLabel },
                        },
                        sort: -5,
                    },
                    ...helpers.leveledLabels(
                        [2, 6, 12, 16],
                        ["1", "d6", "d8", "d10"],
                        (damage) => ({
                            text: {
                                type: "key",
                                key: lkey("persistent"),
                                parameters: {
                                    damage: damage,
                                    creature: creatureLabel,
                                },
                            },
                            sort: -5,
                        }),
                    ),
                    {
                        levelMin: 6,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("tech.level-6-enfeebled"),
                            parameters: { creature: creatureLabel },
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 14,
                        levelMax: 19,
                        text: {
                            type: "key",
                            key: lkey("tech.level-14-enfeebled"),
                            parameters: { creature: creatureLabel },
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.level-20-enfeebled"),
                            parameters: { creature: creatureLabel },
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 10,
                        text: {
                            type: "key",
                            key: lkey("tech.level-10-resistance"),
                            parameters: { creature: creatureLabel },
                        },
                        sort: 2,
                    },
                ],
            },
            effects: [
                {
                    ...helpers.damage.effect({
                        value: 1,
                        label: labelMight,
                        predicate: predicate,
                    }),
                    levelMin: 4,
                },
                ...helpers.leveledEffects(
                    [2, 6, 12, 16],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            value: damage,
                            category: "persistent",
                            label: labelMight,
                            predicate: predicate,
                        }),
                ),
                {
                    levelMin: 6,
                    levelMax: 13,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("effects.level-6-note"),
                        title: labelMight as string,
                        selector: ["{item|id}-attack"],
                    },
                },
                {
                    levelMin: 14,
                    levelMax: 19,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("effects.level-14-note"),
                        title: labelMight as string,
                        selector: ["{item|id}-attack"],
                    },
                },
                {
                    levelMin: 20,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        outcome: ["criticalSuccess"],
                        text: lkey("tech.effects.level-20-note"),
                        title: labelMight as string,
                        selector: ["{item|id}-attack"],
                    },
                },
                {
                    levelMin: 10,
                    type: "RuleElement",
                    rule: {
                        key: "Note",
                        text: lkey("tech.effects.level-10-note"),
                        title: labelMight as string,
                        selector: ["{item|id}-damage"],
                    },
                },
            ],
        },
    ];
}
