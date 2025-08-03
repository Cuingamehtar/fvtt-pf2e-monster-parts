import { getConfig } from "../../config";
import { t } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

export function createImbueBane(): ImbueSource[] {
    return getConfig().baneCreatureTraits.flatMap(baneImbue);
}

function baneImbue(creature: string): ImbueSource[] {
    const creatureLabel = game.i18n.localize(
        `PF2E.Trait${creature[0].toUpperCase() + creature.slice(1)}`,
    );
    const predicate = [`target:trait:${creature}`];
    const labelMight = t("imbue.bane.label", {
        creature: creatureLabel,
        variant: t("imbue.variant.might"),
    });
    const labelTech = t("imbue.bane.label", {
        creature: creatureLabel,
        variant: t("imbue.variant.tech"),
    });

    return [
        {
            key: `imbue:bane:${creature}:might`,
            type: "imbue",
            label: labelMight,
            monsterPredicate: [`self:trait:${creature}`],
            itemPredicate: ["item:type:weapon"],
            effects: [
                {
                    ...levelRange(2, 3),
                    effects: addDamage({
                        value: 1,
                        text: t("imbue.bane.damage", {
                            damage: 1,
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelMight,
                    }),
                },
                {
                    ...levelRange(4, 5),
                    effects: addDamage({
                        value: "d4",
                        text: t("imbue.bane.damage", {
                            damage: "1d4",
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelMight,
                    }),
                },
                {
                    ...levelRange(6, 15),
                    effects: addDamage({
                        value: "d6",
                        text: t("imbue.bane.damage", {
                            damage: "1d6",
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelMight,
                    }),
                },
                {
                    ...levelRange(16, 19),
                    effects: addDamage({
                        value: "d8",
                        text: t("imbue.bane.damage", {
                            damage: "1d8",
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelMight,
                    }),
                },
                {
                    ...levelRange(20),
                    effects: addDamage({
                        value: "d10",
                        text: t("imbue.bane.damage", {
                            damage: "1d10",
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelMight,
                    }),
                },
                {
                    ...levelRange(6, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: t("imbue.bane.might.level-6", {
                                creature: creatureLabel,
                            }),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: t("imbue.bane.might.level-14", {
                                creature: creatureLabel,
                            }),
                        },
                    ],
                },
                {
                    ...levelRange(10),
                    effects: [
                        {
                            key: "InlineNote",
                            text: t("imbue.bane.might.level-10", {
                                creature: creatureLabel,
                            }),
                        },
                    ],
                },
            ],
        },
        {
            key: `imbue:bane:${creature}:tech`,
            type: "imbue",
            label: labelTech,
            monsterPredicate: [`self:trait:${creature}`],
            itemPredicate: ["item:type:weapon"],
            effects: [
                {
                    ...levelRange(4),
                    effects: addDamage({
                        value: 1,
                        text: t("imbue.bane.damage", {
                            damage: 1,
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelTech,
                    }),
                },
                {
                    ...levelRange(2, 5),
                    effects: addDamage({
                        value: 1,
                        type: "bleed",
                        category: "persistent",
                        text: t("imbue.bane.persistent", {
                            damage: 1,
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelTech,
                    }),
                },
                {
                    ...levelRange(6, 11),
                    effects: addDamage({
                        value: "d6",
                        type: "bleed",
                        category: "persistent",
                        text: t("imbue.bane.persistent", {
                            damage: "1d6",
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelTech,
                    }),
                },
                {
                    ...levelRange(12, 15),
                    effects: addDamage({
                        value: "d8",
                        type: "bleed",
                        category: "persistent",
                        text: t("imbue.bane.persistent", {
                            damage: "1d8",
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelTech,
                    }),
                },
                {
                    ...levelRange(16),
                    effects: addDamage({
                        value: "d10",
                        type: "bleed",
                        category: "persistent",
                        text: t("imbue.bane.persistent", {
                            damage: "1d10",
                            creature: creatureLabel,
                        }),
                        predicate,
                        label: labelTech,
                    }),
                },
                {
                    ...levelRange(6, 13),
                    effects: [
                        {
                            key: "InlineNote",
                            text: t("imbue.bane.tech.level-6", {
                                creature: creatureLabel,
                            }),
                        },
                    ],
                },
                {
                    ...levelRange(14),
                    effects: [
                        {
                            key: "InlineNote",
                            text: t("imbue.bane.tech.level-14", {
                                creature: creatureLabel,
                            }),
                        },
                    ],
                },
                {
                    ...levelRange(20),
                    effects: [
                        {
                            key: "InlineNote",
                            text: t("imbue.bane.tech.level-20", {
                                creature: creatureLabel,
                            }),
                        },
                    ],
                },
                {
                    ...levelRange(10),
                    effects: [
                        {
                            key: "InlineNote",
                            text: t("imbue.bane.tech.level-10", {
                                creature: creatureLabel,
                            }),
                        },
                    ],
                },
            ],
        },
    ];
}
