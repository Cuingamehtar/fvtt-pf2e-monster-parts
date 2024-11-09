export function setPotency(potency) {
    return (item) => item.update({ "system.runes.potency": potency });
}

export function setStriking(potency) {
    return (item) => item.update({ "system.runes.striking": potency });
}

export function setResilient(potency) {
    return (item) => item.update({ "system.runes.resilient": potency });
}

export function setShieldValues(hardness, hp) {
    return (item) => {
        const isBuckler = item.system.baseItem === "buckler";
        if (isBuckler) {
            hardness -= 2;
            hp -= 12;
        }
        return item.update({ "system.hp.max": hp, "system.hardness": hardness });
    }
}

export function addBonus(skill, bonus) {
    return (item) => {
        const re = {
            key: "FlatModifier",
            selector: skill,
            type: "item",
            value: bonus
        };
        return item.update({ "system.rules": [...(actor.system.rules), re] });
    }
}

export function hasTrait(trait) {
    return (actor) => actor.system.traits.value.some(t => t == trait);
}

export function hasAttack(damageType) {
    return (actor) => {
        const actions = actor.system.actions;
        return actions.some(a => a.weapon?.baseDamage?.damageType == damageType);
    }
}

export function hasSkill(skill) {
    return (actor) => actor.system.skills[skill]?.base > 0;
}

export function hasSpecialSense() {
    const senses = ["darkvision", "truesight", "scent", "tremorsense", "echolocation", "greater-darkvision", "infrared-vision", "motion-sense", "see-invisibility", "wavesense"];
    return (actor) => actor.system.perception.senses.some(s => senses.includes(s.type));
}

export function hasSpell(){
    // TODO
    returns(false);
}

export function addFlatDamage(params) {
    const re = {
        "key": "FlatModifier",
        "selector": "{item|_id}-damage",
        "value": 1,
        ...params
    };
    return (actor) => actor.update({ "system.rules": [...system.rules, re] });
}

export function addDamageDie(params) {
    const re = {
        "diceNumber": 1,
        "dieSize": "d4",
        "key": "DamageDice",
        "selector": "{item|_id}-damage",
        ...params
    };
    return (actor) => actor.update({ "system.rules": [...system.rules, re] });
}
