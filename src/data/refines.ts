import { SkillSlug } from "foundry-pf2e";
import { MaterialEffectSource, RefinementSource } from "./data-types";
import { levelRange, predicateAnySense } from "./helpers";
import { tkey } from "../utils";

export function createDefaultRefinements() {

    const skills = Object.keys(CONFIG.PF2E.skills) as SkillSlug[];

    const weaponEffects: MaterialEffectSource[] = [
        {
            ...levelRange(2, 9),
            effects: [{ key: "ItemPotency", value: 1 }]
        },
        {
            ...levelRange(10, 15),
            effects: [{ key: "ItemPotency", value: 2 }]
        },
        {
            ...levelRange(16),
            effects: [{ key: "ItemPotency", value: 3 }]
        },
        {
            ...levelRange(4, 11),
            effects: [{ key: "WeaponStriking", value: 1 }]
        },
        {
            ...levelRange(12, 18),
            effects: [{ key: "WeaponStriking", value: 2 }]
        },
        {
            ...levelRange(19),
            effects: [{ key: "WeaponStriking", value: 3 }]
        }
    ]

    const armorEffects: MaterialEffectSource[] = [
        {
            ...levelRange(5, 10),
            effects: [{ key: "ItemPotency", value: 1 }]
        },
        {
            ...levelRange(11, 17),
            effects: [{ key: "ItemPotency", value: 2 }]
        },
        {
            ...levelRange(18),
            effects: [{ key: "ItemPotency", value: 3 }]
        },
        {
            ...levelRange(8, 13),
            effects: [{ key: "ArmorResilient", value: 1 }]
        },
        {
            ...levelRange(14, 19),
            effects: [{ key: "ArmorResilient", value: 2 }]
        },
        {
            ...levelRange(20),
            effects: [{ key: "ArmorResilient", value: 3 }]
        }
    ]

    const shieldEffects: MaterialEffectSource[] = [
        {
            ...levelRange(3, 4),
            effects: [{ key: "ShieldImprovement", hardness: 5, hp: 30 }]
        },
        {
            ...levelRange(5, 6),
            effects: [{ key: "ShieldImprovement", hardness: 6, hp: 36 }]
        },
        {
            ...levelRange(7, 7),
            effects: [{ key: "ShieldImprovement", hardness: 7, hp: 42 }]
        },
        {
            ...levelRange(8, 8),
            effects: [{ key: "ShieldImprovement", hardness: 8, hp: 48 }]
        },
        {
            ...levelRange(9, 9),
            effects: [{ key: "ShieldImprovement", hardness: 9, hp: 54 }]
        },
        {
            ...levelRange(10, 11),
            effects: [{ key: "ShieldImprovement", hardness: 10, hp: 60 }]
        },
        {
            ...levelRange(12, 12),
            effects: [{ key: "ShieldImprovement", hardness: 11, hp: 66 }]
        },
        {
            ...levelRange(13, 14),
            effects: [{ key: "ShieldImprovement", hardness: 12, hp: 72 }]
        },
        {
            ...levelRange(15, 15),
            effects: [{ key: "ShieldImprovement", hardness: 13, hp: 78 }]
        },
        {
            ...levelRange(16, 16),
            effects: [{ key: "ShieldImprovement", hardness: 14, hp: 84 }]
        },
        {
            ...levelRange(17, 17),
            effects: [{ key: "ShieldImprovement", hardness: 15, hp: 90 }]
        },
        {
            ...levelRange(18, 18),
            effects: [{ key: "ShieldImprovement", hardness: 16, hp: 96 }]
        },
        {
            ...levelRange(19, 19),
            effects: [{ key: "ShieldImprovement", hardness: 17, hp: 102 }]
        },
        {
            ...levelRange(20),
            effects: [{ key: "ShieldImprovement", hardness: 18, hp: 108 }]
        }
    ]

    const skillEffects: ((_: SkillSlug | "perception") => MaterialEffectSource[]) = (skill) => [
        {
            ...levelRange(3, 8),
            effects: [{ key: "SkillModifier", skill, value: 1 }]
        },
        {
            ...levelRange(9, 16),
            effects: [{ key: "SkillModifier", skill, value: 2 }]
        },
        {
            ...levelRange(17),
            effects: [{ key: "SkillModifier", skill, value: 3 }]
        }
    ]

    function skillRefinement(skill: SkillSlug): RefinementSource {
        return {
            key: `refinement:skill:${skill}`,
            label: CONFIG.PF2E.skills[skill].label,
            type: "refinement",
            itemPredicate: ["item:type:equipment"],
            monsterPredicate: [`skill:${skill}:rank:1`],
            effects: skillEffects(skill)
        }
    }

    const refines: RefinementSource[] = [
        {
            key: "refinement:weapon:bludgeoning",
            type: "refinement",
            label: tkey(`Refinement.Bludgeoning`),
            itemPredicate: ["item:type:weapon", "weapon:damage:type:bludgeoning"],
            monsterPredicate: ["item:type:melee", "melee:damage:type:bludgeoning"],
            effects: weaponEffects
        },
        {
            key: "refinement:weapon:piercing",
            type: "refinement",
            label: tkey(`Refinement.Piercing`),
            itemPredicate: ["item:type:weapon", "weapon:damage:type:piercing"],
            monsterPredicate: ["item:type:melee", "melee:damage:type:piercing"],
            effects: weaponEffects
        },
        {
            key: "refinement:weapon:slashing",
            type: "refinement",
            label: tkey(`Refinement.Slashing`),
            itemPredicate: ["item:type:weapon", "weapon:damage:type:slashing"],
            monsterPredicate: ["item:type:melee", "melee:damage:type:slashing"],
            effects: weaponEffects
        },
        {
            key: "refinement:armor:light",
            type: "refinement",
            label: tkey(`Refinement.ArmorLight`),
            itemPredicate: ["item:type:armor", "armor:category:light"],
            monsterPredicate: undefined,
            effects: armorEffects
        },
        {
            key: "refinement:armor:medium",
            type: "refinement",
            label: tkey(`Refinement.ArmorMedium`),
            itemPredicate: ["item:type:armor", "armor:category:medium"],
            monsterPredicate: undefined,
            effects: armorEffects
        },
        {
            key: "refinement:armor:heavy",
            type: "refinement",
            label: tkey(`Refinement.ArmorHeavy`),
            itemPredicate: ["item:type:armor", "armor:category:heavy"],
            monsterPredicate: undefined,
            effects: armorEffects
        },
        {
            key: "refinement:shield",
            type: "refinement",
            label: tkey(`Refinement.Shield`),
            itemPredicate: ["item:type:shield"],
            monsterPredicate: [
                {
                    "or": [{ "gte": ["self:hardness", 0] },
                    { "gte": ["self:resistance:physical", 0] },
                    { "gte": ["self:resistance:bludgeoning", 0] },
                    { "gte": ["self:resistance:piercing", 0] },
                    { "gte": ["self:resistance:slashing", 0] }]
                }],
            effects: shieldEffects
        },

        ...skills.map(s => skillRefinement(s)),

        {
            key: "refinement:perception",
            type: "refinement",
            label: tkey(`Refinement.Perception`),
            monsterPredicate: [predicateAnySense()],
            itemPredicate: ["item:type:equipment"],
            effects: skillEffects("perception")
        }
    ];
    return refines;
}