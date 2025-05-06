import type { ActorPF2e, ArmorPF2e, CreaturePF2e, DamageType, ItemPF2e, PhysicalItemPF2e, ShieldPF2e, SkillSlug, WeaponPF2e } from "foundry-pf2e";

export function setPotency(value: number) {
    return (item: WeaponPF2e) => item.update({ "system.runes.potency": value });
}

export function setStriking(value: number) {
    return (item: WeaponPF2e) => item.update({ "system.runes.striking": value });
}

export function setResilient(value: number) {
    return (item: ArmorPF2e) => item.update({ "system.runes.resilient": value });
}

export function setShieldValues(hardness: number, hp: number) {
    return (item: ShieldPF2e) => {
        const isBuckler = item.system.baseItem === "buckler";
        if (isBuckler) {
            hardness -= 2;
            hp -= 12;
        }
        return item.update({ "system.hp.max": hp, "system.hardness": hardness });
    }
}

export function addBonus(skill: SkillSlug | "perception", bonus: number) {
    return (item: PhysicalItemPF2e) => {
        const re = {
            key: "FlatModifier",
            selector: skill,
            type: "item",
            value: bonus
        };
        return item.update({ "system.rules": [...(item.system.rules), re] });
    }
}

export function hasTrait(trait: string): ((_: ActorPF2e) => boolean) {
    return (actor: ActorPF2e) => actor.system.traits?.value.some(t => t == trait) ?? false;
}

export function hasAttack(damageType: DamageType) {
    return (actor: CreaturePF2e) => {
        const actions = actor.system.actions ?? [];
        // @ts-ignore
        return actions.some(a => a.weapon?.baseDamage?.damageType == damageType);
    }
}

export function hasSkill(skill: SkillSlug) {
    // @ts-ignore
    return (actor: CreaturePF2e) => actor.system.skills[skill]?.base > 0;
}

export function getExtendedItemRollOptions(item: ItemPF2e) {
    return [...item.getRollOptions(), `item:type:${item.type}`]
}

export function getExtendedNPCRollOptions(actor: CreaturePF2e): string[] {
    const baseRollOptions = actor.getRollOptions();
    const senses = ["darkvision", "truesight", "scent", "tremorsense", "echolocation", "greater-darkvision", "infrared-vision", "motion-sense", "see-invisibility", "wavesense"].filter(s => actor.system.perception.senses
        .some(sense => sense.type == s))
        .map(s => `sense:${s}`);
    const skills = Object.values(actor.system.skills)
        .filter(s => s.base > 0)
        .map(s => `skill:${s.slug}:rank:1`);
    const resistances = actor.system.attributes.resistances
        .filter(r => ["physical", "bludgeoning", "piercing", "slashing"].includes(r.type))
        .map(r => `self:resistance:${r.type}:${r.value}`);

    return [...baseRollOptions, ...senses, ...skills, `self:hardness:${actor.hardness}`, ...resistances];
}