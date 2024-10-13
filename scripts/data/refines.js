import { setPotency, setResilient, setShieldValues, setStriking, hasAttack, addBonus, hasSkill, hasSpecialSense } from "../itemUtil.js";

const skills = Object.keys(CONFIG.PF2E.skills);

const weaponEffects = [
    {
        levelMin: 2,
        levelMax: 9,
        effect: setPotency(1)
    },
    {
        levelMin: 10,
        levelMax: 15,
        effect: setPotency(2)
    },
    {
        levelMin: 16,
        effect: setPotency(3)
    },
    {
        levelMin: 4,
        levelMax: 11,
        effect: setStriking(1)
    },
    {
        levelMin: 12,
        levelMax: 18,
        effect: setStriking(2)
    },
    {
        levelMin: 19,
        effect: setStriking(3)
    }
]

const armorEffects = [
    {
        levelMin: 5,
        levelMax: 10,
        effect: setPotency(1)
    },
    {
        levelMin: 11,
        levelMax: 17,
        effect: setPotency(2)
    },
    {
        levelMin: 18,
        effect: setPotency(3)
    },
    {
        levelMin: 8,
        levelMax: 13,
        effect: setResilient(1)
    },
    {
        levelMin: 14,
        levelMax: 19,
        effect: setResilient(2)
    },
    {
        levelMin: 20,
        effect: setResilient(3)
    }
]

const shieldEffects = [
    {
        levelMin:3,
        levelMax:4,
        effect: setShieldValues(5, 30)
    },
    {
        levelMin:5,
        levelMax:6,
        effect: setShieldValues(6, 36)
    },
    {
        levelMin:7,
        levelMax:7,
        effect: setShieldValues(7, 42)
    },
    {
        levelMin:8,
        levelMax:8,
        effect: setShieldValues(8, 48)
    },
    {
        levelMin:9,
        levelMax:9,
        effect: setShieldValues(9, 54)
    },
    {
        levelMin:10,
        levelMax:11,
        effect: setShieldValues(10, 60)
    },
    {
        levelMin:12,
        levelMax:12,
        effect: setShieldValues(11, 66)
    },
    {
        levelMin:13,
        levelMax:14,
        effect: setShieldValues(12, 72)
    },
    {
        levelMin:15,
        levelMax:15,
        effect: setShieldValues(13, 78)
    },
    {
        levelMin:16,
        levelMax:16,
        effect: setShieldValues(14, 84)
    },
    {
        levelMin:17,
        levelMax:17,
        effect: setShieldValues(15, 90)
    },
    {
        levelMin:18,
        levelMax:18,
        effect: setShieldValues(16, 96)
    },
    {
        levelMin:19,
        levelMax:19,
        effect: setShieldValues(17, 102)
    },
    {
        levelMin:20,
        effect: setShieldValues(18, 108)
    }
]

const skillEffects = (skill) => [
    {
        levelMin:3,
        levelMax:8,
        effect: addBonus(skill, 1)
    },
    {
        levelMin:9,
        levelMax:16,
        effect: addBonus(skill, 2)
    },
    {
        levelMin:17,
        effect: addBonus(skill, 3)
    }
]

function skillRefinement(skill){
    return {
        [`refinement:skill:${skill}`]: {
            type:"skill",
            isMaterial: hasSkill(skill),
            effects: skillEffects(skill)
        }
    }
}

export const refines = {
    "refinement:weapon:bludgeoning": {
        type: "weapon",
        isMaterial: hasAttack("bludgeoning"),
        effects: weaponEffects
    },
    "refinement:weapon:piercing": {
        type: "weapon",
        isMaterial: hasAttack("piercing"),
        effects: weaponEffects
    },
    "refinement:weapon:slashing": {
        type: "weapon",
        isMaterial: hasAttack("slashing"),
        effects: weaponEffects
    },

    "refinement:armor:light": {
        type: "armor",
        isMaterial: returns(false),
        effects: armorEffects
    },
    "refinement:armor:medium": {
        type: "armor",
        isMaterial: returns(false),
        effects: armorEffects
    },
    "refinement:armor:heavy": {
        type: "armor",
        isMaterial: returns(false),
        effects: armorEffects
    },

    "refinement:shield": {
        type: "shield",
        isMaterial: (actor) => actor.hardness > 0 || actor.system.attributes.resistances.some(r => ["physical", "bludgeoning", "piercing", "slashing"].includes(r.type)),
        effects: shieldEffects
    },

    ...skills.map(s => [s, skillRefinement(s)]),

    "refinement:skill:perception": {
        type:"perception",
        isMaterial: hasSpecialSense(),
        effects: skillEffects(perception)
    }

}