import { ImbueSource } from "../data-types";

const CREATURETYPES = ["aberration", "animal", "astral", "beast", "celestial", "construct", "dragon", "dream", "elemental", "ethereal", "fey", "fiend", "giant", "monitor", "ooze", "spirit", "time", "vitality", "void"]

function createBaneImbues():ImbueSource[] {
    const baneImbues:ImbueSource[] = [];
    for (const creature of CREATURETYPES) {
        const creatureLabel = t(`CreatureTypes.${creature}`);
        const predicate = [`target:trait:${creature}`];
        const labelMight = t("Imbues.Bane.Might.Label", { bane: creatureLabel });
        const labelTech = t("Imbues.Bane.Tech.Label", { bane: creatureLabel })

        baneImbues[`imbue:bane:${creature}:might`] = {
            type: "weapon",
            isMaterial: hasTrait(creature),
            effects: [
                {
                    levelMin: 2,
                    levelMax: 3,
                    effect: forEach(addNote(t("Damage.Bane.Flat1", { bane: creatureLabel })), addFlatDamage({ label: labelMight, predicate }))
                },
                {
                    levelMin: 4,
                    levelMax: 5,
                    effects: forEach(addNote(t("Damage.Bane.D4", { bane: creatureLabel })), addDamageDie({ label: labelMight, dieSize: "d4", predicate }))
                },
                {
                    levelMin: 6,
                    levelMax: 15,
                    effect: forEach(addNote(t("Damage.Bane.D6", { bane: creatureLabel })), addDamageDie({ label: labelMight, dieSize: "d6", predicate }))
                },
                {
                    levelMin: 6,
                    levelMax: 13,
                    effect: addNote(t("Imbue.Bane.Might.Level6", { bane: creatureLabel }))
                },
                {
                    levelMin: 10,
                    effect: addNote(t("Imbue.Bane.Might.Level10", { bane: creatureLabel }))
                },
                {
                    levelMin: 14,
                    effect: addNote(t("Imbue.Bane.Might.Level14", { bane: creatureLabel }))
                },
                {
                    levelMin: 16,
                    levelMax: 19,
                    effect: forEach(addNote(t("Damage.Bane.D8", { bane: creatureLabel })), addDamageDie({ label: labelMight, dieSize: "d8", predicate }))
                },
                {
                    levelMin: 20,
                    effect: forEach(addNote(t("Damage.Bane.D10", { bane: creatureLabel })), addDamageDie({ label: labelMight, dieSize: "d10", predicate }))
                }
            ]
        };
        baneImbues[`imbue:bane:${creature}:tech`] = {
            type: "weapon",
            isMaterial: hasTrait(creature),
            effects: [
                {
                    levelMin: 2,
                    levelMax: 5,
                    effect: forEach(addNote(t("Damage.Bane.Persistent1", { bane: creatureLabel })), addFlatDamage({ label: labelTech, damageType: "bleed", damageCategory: "persistent", predicate }))
                },
                {
                    levelMin: 4,
                    effects: forEach(addNote(t("Damage.Bane.Flat1", { bane: creatureLabel })), addFlatDamage({ label: labelTech, predicate }))
                },
                {
                    levelMin: 6,
                    levelMax: 11,
                    effect: forEach(addNote(t("Damage.Bane.PersistentD6", { bane: creatureLabel })), addDamageDie({ label: labelTech, dieSize: "d6", damageType: "bleed", category: "persistent", predicate }))
                },
                {
                    levelMin: 6,
                    levelMax: 13,
                    effect: addNote(t("Imbue.Bane.Tech.Level6", { bane: creatureLabel }))
                },
                {
                    levelMin: 10,
                    effect: addNote(t("Imbue.Bane.Tech.Level10", { bane: creatureLabel }))
                },
                {
                    levelMin: 12,
                    levelMax: 15,
                    effect: forEach(addNote(t("Damage.Bane.PersistentD8", { bane: creatureLabel })), addDamageDie({ label: labelTech, dieSize: "d8", damageType: "bleed", category: "persistent", predicate }))
                },
                {
                    levelMin: 14,
                    levelMax: 19,
                    effect: addNote(t("Imbue.Bane.Might.Level14", { bane: creatureLabel }))
                },
                {
                    levelMin: 16,
                    effect: forEach(addNote(t("Damage.Bane.PersistentD10", { bane: creatureLabel })), addDamageDie({ label: labelTech, dieSize: "d10", damageType: "bleed", category: "persistent", predicate }))
                },
                {
                    levelMin: 20,
                    effect: addNote(t("Imbue.Bane.Might.Level20", { bane: creatureLabel }))
                }
            ]
        }
    }
    return baneImbues;
}
