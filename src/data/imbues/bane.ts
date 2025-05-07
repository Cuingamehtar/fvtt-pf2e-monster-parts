import { t } from "../../utils";
import { ImbueSource } from "../data-types";
import { addDamage, levelRange } from "../helpers";

const CREATURETYPES = ["aberration", "animal", "astral", "beast", "celestial", "construct", "dragon", "dream", "elemental", "ethereal", "fey", "fiend", "giant", "monitor", "ooze", "spirit", "time", "vitality", "void"]

export function createImbueBane() {
    return CREATURETYPES.flatMap(baneImbue);
}

function baneImbue(creature: string): ImbueSource[] {
    const creatureLabel = game.i18n.localize(`PF2E.Trait${creature[0].toUpperCase() + creature.slice(1)}`);
    const predicate = [`target:trait:${creature}`];
    const labelMight = t("Imbue.Bane.Label", { creature: creatureLabel, variant: t("Imbue.Variant.Might") });
    const labelTech = t("Imbue.Bane.Label", { creature: creatureLabel, variant: t("Imbue.Variant.Tech") });

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
                        text: t("Imbue.Bane.Damage", { damage: 1, creature: creatureLabel }),
                        predicate,
                        label: labelMight
                    })
                },
                {
                    ...levelRange(4, 5),
                    effects: addDamage({
                        value: "d4",
                        text: t("Imbue.Bane.Damage", { damage: "1d4", creature: creatureLabel }),
                        predicate,
                        label: labelMight
                    })
                },
                {
                    ...levelRange(6, 15),
                    effects: addDamage({
                        value: "d6",
                        text: t("Imbue.Bane.Damage", { damage: "1d6", creature: creatureLabel }),
                        predicate,
                        label: labelMight
                    })
                },
                {
                    ...levelRange(16, 19),
                    effects: addDamage({
                        value: "d8",
                        text: t("Imbue.Bane.Damage", { damage: "1d8", creature: creatureLabel }),
                        predicate,
                        label: labelMight
                    })
                },
                {
                    ...levelRange(20),
                    effects: addDamage({
                        value: "d10",
                        text: t("Imbue.Bane.Damage", { damage: "1d10", creature: creatureLabel }),
                        predicate,
                        label: labelMight
                    })
                },
                {
                    ...levelRange(6, 13),
                    effects: [{
                        key: "InlineNote",
                        text: t("Imbue.Bane.Might.Level6", {creature:creatureLabel})
                    }]
                },
                {
                    ...levelRange(14),
                    effects: [{
                        key: "InlineNote",
                        text: t("Imbue.Bane.Might.Level14", {creature:creatureLabel})
                    }]
                },
                {
                    ...levelRange(10),
                    effects: [{
                        key: "InlineNote",
                        text: t("Imbue.Bane.Might.Level10", {creature:creatureLabel})
                    }]
                }
            ]
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
                        text: t("Imbue.Bane.Damage", { damage: 1, creature: creatureLabel }),
                        predicate,
                        label: labelTech
                    })
                },
                {
                    ...levelRange(2, 5),
                    effects: addDamage({
                        value: 1,
                        text: t("Imbue.Bane.Persistent", { damage: 1, creature: creatureLabel }),
                        predicate,
                        label: labelTech
                    })
                },
                {
                    ...levelRange(6, 11),
                    effects: addDamage({
                        value: "d6",
                        text: t("Imbue.Bane.Persistent", { damage: "1d6", creature: creatureLabel }),
                        predicate,
                        label: labelTech
                    })
                },
                {
                    ...levelRange(12, 15),
                    effects: addDamage({
                        value: "d8",
                        text: t("Imbue.Bane.Persistent", { damage: "1d8", creature: creatureLabel }),
                        predicate,
                        label: labelTech
                    })
                },
                {
                    ...levelRange(16),
                    effects: addDamage({
                        value: "d10",
                        text: t("Imbue.Bane.Persistent", { damage: "1d10", creature: creatureLabel }),
                        predicate,
                        label: labelTech
                    })
                },
                {
                    ...levelRange(6, 13),
                    effects: [{
                        key: "InlineNote",
                        text: t("Imbue.Bane.Tech.Level6", {creature:creatureLabel})
                    }]
                },
                {
                    ...levelRange(14),
                    effects: [{
                        key: "InlineNote",
                        text: t("Imbue.Bane.Tech.Level14", {creature:creatureLabel})
                    }]
                },
                {
                    ...levelRange(20),
                    effects: [{
                        key: "InlineNote",
                        text: t("Imbue.Bane.Tech.Level20", {creature:creatureLabel})
                    }]
                },
                {
                    ...levelRange(10),
                    effects: [{
                        key: "InlineNote",
                        text: t("Imbue.Bane.Tech.Level10", {creature:creatureLabel})
                    }]
                }
            ]
        }
    ];
}
