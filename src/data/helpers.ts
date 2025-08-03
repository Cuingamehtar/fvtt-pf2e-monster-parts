import { Abilities, PredicateStatement, SkillSlug } from "foundry-pf2e";
import { tkey } from "../utils";
import { InlineNoteEffectSource, RuleElementEffectSource } from "./data-types";

export function levelRange(from: number, to?: number) {
    return { levels: { from, to } };
}
export function predicateAnySense() {
    return {
        or: [
            "darkvision",
            "truesight",
            "scent",
            "tremorsense",
            "echolocation",
            "greater-darkvision",
            "infrared-vision",
            "motion-sense",
            "see-invisibility",
            "wavesense",
        ].map((s) => `sense:${s}`),
    };
}

export function skillsOfAttribute(attribute: keyof Abilities): SkillSlug[] {
    return Object.entries(CONFIG.PF2E.skills)
        .filter(([_, v]) => v.attribute === attribute)
        .map(([k, _]) => k as SkillSlug);
}

export function addDamage({
    type,
    category,
    value,
    text,
    label,
    predicate,
}: {
    type?: string;
    category?: "persistent";
    value: number | `${number}d${number}` | `d${number}`;
    label: I18nKey | I18nString;
    text?: I18nKey | I18nString;
    predicate?: PredicateStatement[];
}) {
    const effects: (RuleElementEffectSource | InlineNoteEffectSource)[] = [
        {
            key: "InlineNote",
            text:
                text ??
                tkey(
                    category === "persistent"
                        ? "damage.persistent"
                        : "damage.normal",
                ),
            parameters: {
                damage: value ?? 1,
                damageType: type,
            },
        },
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
                label: label as string,
            },
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
                label: label as string,
            },
        });
    }
    return effects;
}

export function addWildDamage(
    value: number | `${number}d${number}` | `d${number}`,
    label: I18nKey | I18nString,
) {
    const damages = ["acid", "cold", "electricity", "fire", "void", "sonic"];

    const effects: (RuleElementEffectSource | InlineNoteEffectSource)[] = [
        {
            key: "InlineNote",
            text: tkey("imbue.wild.might.damage"),
            parameters: {
                damage: value,
            },
        },
    ];
    if (typeof value === "undefined" || typeof value === "number") {
        effects.push(
            ...damages.map(
                (damageType, i) =>
                    ({
                        key: "RuleElement",
                        rule: {
                            key: "FlatModifier",
                            selector: "{item|_id}-damage",
                            damageType,
                            value: value ?? 1,
                            predicate: [`wild:damage-type:${i + 1}`],
                            label: label,
                            hideIfDisabled: true,
                        },
                    }) as RuleElementEffectSource,
            ),
        );
    } else {
        const m = value.match(/(\d+)?(d\d+)/);
        effects.push(
            ...damages.map(
                (damageType, i) =>
                    ({
                        key: "RuleElement",
                        rule: {
                            key: "DamageDice",
                            selector: "{item|_id}-damage",
                            damageType,
                            dieSize: m?.[2] ?? "d4",
                            diceNumber: m?.[1] ?? 1,
                            predicate: [`wild:damage-type:${i + 1}`],
                            label: label,
                            hideIfDisabled: true,
                        },
                    }) as RuleElementEffectSource,
            ),
        );
    }
    return effects;
}

export const or = (content: any[]) => ({ or: content });
