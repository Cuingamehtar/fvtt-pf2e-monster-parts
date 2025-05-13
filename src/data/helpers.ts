import { Abilities, PredicateStatement, SkillSlug } from "foundry-pf2e";
import { tkey } from "../utils";
import { InlineNoteEffectSource, RuleElementEffectSource } from "./data-types";

export function levelRange(from: number, to?: number) {
    return { levels: { from, to } }
}
export function predicateAnySense() {
    return { or: ["darkvision", "truesight", "scent", "tremorsense", "echolocation", "greater-darkvision", "infrared-vision", "motion-sense", "see-invisibility", "wavesense"].map(s => `sense:${s}`) };
}

export function skillsOfAttribute(attribute: keyof Abilities): SkillSlug[] {
    return Object.entries(CONFIG.PF2E.skills)
        .filter(([_, v]) => v.attribute == attribute)
        .map(([k, _]) => k as SkillSlug)
}

export function addDamage({ type, category, value, text, label, predicate }: { type?: string, category?: "persistent", value: number | `${number}d${number}` | `d${number}`, label: string, text?: string, predicate?: Array<PredicateStatement> }) {
    const effects: (RuleElementEffectSource | InlineNoteEffectSource)[] = [
        {
            key: "InlineNote",
            text: text ?? tkey(category == "persistent" ? "Damage.Persisitent" : "Damage.Normal"),
            parameters: {
                damage: value ?? 1,
                damageType: type
            }
        }
    ];
    if (typeof value === "undefined" || typeof value === "number") {
        effects.push({
            key: "RuleElement",
            rule: {
                key: "FlatModifier",
                selector: "{item|_id}-damage",
                damageType: type,
                damageCategory: category,
                value: value ?? 1,
                predicate,
                label
            }
        });
    } else {
        const m = value.match(/(\d+)?(d\d+)/);
        effects.push({
            key: "RuleElement",
            rule: {
                key: "DamageDice",
                selector: "{item|_id}-damage",
                damageType: type,
                damageCategory: category,
                dieSize: m?.[2] ?? "d4",
                diceNumber: m?.[1] ?? 1,
                predicate,
                label
            }
        });
    }
    return effects;
}