import { DamageDiceSource, FlatModifierSource } from "foundry-pf2e";

export function levelRange(from: number, to?: number) {
    return { levels: { from, to } }
}
export function predicateAnySense() {
    return { or: ["darkvision", "truesight", "scent", "tremorsense", "echolocation", "greater-darkvision", "infrared-vision", "motion-sense", "see-invisibility", "wavesense"].map(s => `sense:${s}`) };
}

export function addFlatDamage({type, category, value, label}:{type:string, category?:"persistent", value?:number, label:string}):FlatModifierSource {
    const re = {
        key: "FlatModifier",
        selector: "{item|_id}-damage",
        damageType: type,
        damageCategory: category,
        value: value ?? 1,
        label
    };
    return re;
}


export function addDamageDie({type, category, die, number, label}: {type:string, category?:"persistent", die?:string, number?:number, label:string}):DamageDiceSource {
    const re = {
        key: "DamageDice",
        selector: "{item|_id}-damage",
        damageType: type,
        damageCategory: category,
        dieSize: die ?? "d4",
        diceNumber: number ?? 1,
        label
    };
    return re;
}