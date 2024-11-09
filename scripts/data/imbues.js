import { addDamageDie, addFlatDamage, hasAttack, hasSpell, hasTrait } from "../itemUtil.js"
import { any } from "../util.js"

function hasDamageTypeImbue(type) {
    return any(hasTrait(type), hasAttack(type), hasSpell());
}

const CREATURETYPES = ["aberration", "animal", "astral", "beast", "celestial", "construct", "dragon", "dream", "elemental", "ethereal", "fey", "fiend", "giant", "monitor", "ooze", "spirit", "time", "vitality", "void"]

function createBaneImbues() {
    const baneImbues = {};
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

export const imbues = {
    "imbue:acid::magic": {
        type: "weapon",
        isMaterial: hasDamageTypeImbue("acid"),
        effects: [
            {
                levelMin: 2,
                effect: addNote(t("Imbues.AddCantrip", { spell: "Acid Splash" }))
            },
            {
                levelMin: 4,
                levelMax: 5,
                effect: addNote(t("Imbues.Acid.Magic.Level4"))
            },
            {
                levelMin: 6,
                levelMax: 7,
                effect: addNote(t("Imbues.Acid.Magic.Level6"))
            },
            {
                levelMin: 8,
                levelMax: 11,
                effect: addNote(t("Imbues.Acid.Magic.Level8"))
            },
            {
                levelMin: 10,
                levelMax: 13,
                effect: forEach(addNote(t("Damage.Acid.Flat1")), addFlatDamage({ label: t("Imbues.Acid.Magic.Label"), damageType: "acid" }))
            },
            {
                levelMin: 12,
                levelMax: 15,
                effect: addNote(t("Imbues.Acid.Magic.Level12"))
            },
            {
                levelMin: 14,
                levelMax: 17,
                effect: forEach(addNote(t("Damage.Acid.D4")), addDamageDie({ label: t("Imbues.Acid.Magic.Label"), damageType: "acid", dieSize: "d4" }))
            },
            {
                levelMin: 16,
                effect: addNote(t("Imbues.Acid.Magic.Level16"))
            },
            {
                levelMin: 18,
                effect: forEach(addNote(t("Damage.Acid.D6")), addDamageDie({ label: t("Imbues.Acid.Magic.Label"), damageType: "acid", dieSize: "d6" }))
            },
            {
                levelMin: 20,
                effect: addNote(t("Imbues.Acid.Magic.Level20"))
            }
        ]
    },
    "imbue:acid::might": {
        type: "weapon",
        isMaterial: hasDamageTypeImbue("acid"),
        effects: [
            {
                levelMin: 4,
                levelMax: 5,
                effect: forEach(addNote(t("Damage.Acid.Flat1")), addFlatDamage({ label: t("Imbues.Acid.Might.Label"), damageType: "acid" }))
            },
            {
                levelMin: 6,
                levelMax: 7,
                effect: forEach(addNote(t("Damage.Acid.D4")), addDamageDie({ label: t("Imbues.Acid.Might.Label"), damageType: "acid", dieSize: "d4" }))
            },
            {
                levelMin: 8,
                levelMax: 17,
                effect: forEach(addNote(t("Damage.Acid.D6")), addDamageDie({ label: t("Imbues.Acid.Might.Label"), damageType: "acid", dieSize: "d6" }))
            },
            {
                levelMin: 8,
                levelMax: 13,
                effect: addNote(t("Imbues.Acid.Might.Level8"))
            },
            {
                levelMin: 12,
                effect: addNote(t("Imbues.Acid.Might.Level12"))
            },
            {
                levelMin: 14,
                effect: addNote(t("Imbues.Acid.Magic.Level14"))
            },
            {
                levelMin: 18,
                effect: forEach(addNote(t("Damage.Acid.D8")), addDamageDie({ label: t("Imbues.Acid.Might.Label"), damageType: "acid", dieSize: "d8" }))
            },
            {
                levelMin: 20,
                effect: addNote(t("Imbues.Acid.Might.Level20"))
            }
        ]
    },
    "imbue:acid::tech": {
        type: "weapon",
        isMaterial: hasDamageTypeImbue("acid"),
        effects: [
            {
                levelMin: 4,
                levelMax: 7,
                effect: forEach(addNote(t("Damage.Acid.Persistent1")), addFlatDamage({ label: t("Imbues.Acid.Tech.Label"), damageType: "acid", damageCategory: "persistent" }))
            },
            {
                levelMin: 6,
                effect: forEach(addNote(t("Damage.Acid.Flat1")), addFlatDamage({ label: t("Imbues.Acid.Tech.Label"), damageType: "acid" }))
            },
            {
                levelMin: 8,
                levelMax: 17,
                effect: forEach(addNote(t("Damage.Acid.PersistentD6")), addDamageDie({ label: t("Imbues.Acid.Tech.Label"), damageType: "acid", dieSize: "d6", category: "persistent" }))
            },
            {
                levelMin: 8,
                effect: addNote(t("Imbues.Acid.Tech.Level8"))
            },
            {
                levelMin: 12,
                effect: addNote(t("Imbues.Acid.Tech.Level12"))
            },
            {
                levelMin: 14,
                levelMax: 17,
                effect: forEach(addNote(t("Damage.Acid.PersistentD8")), addDamageDie({ label: t("Imbues.Acid.Tech.Label"), damageType: "acid", dieSize: "d8", category: "persistent" }))
            },
            {
                levelMin: 16,
                effect: addNote(t("Imbues.Acid.Tech.Level16"))
            },
            {
                levelMin: 18,
                effect: forEach(addNote(t("Damage.Acid.PersistentD10")), addDamageDie({ label: t("Imbues.Acid.Tech.Label"), damageType: "acid", dieSize: "d10", category: "persistent" }))
            },
            {
                levelMin: 20,
                effect: addNote(t("Imbues.Acid.Might.Level20"))
            }
        ]
    },
    ...createBaneImbues(),
}