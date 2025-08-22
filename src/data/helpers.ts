import { Abilities, PredicateStatement, SkillSlug } from "foundry-pf2e";
import { tkey } from "../utils";
import {
    InlineNoteEffectSource,
    MaterialEffectSource,
    RuleElementEffectSource,
} from "./data-types";
import { ItemAlterationSource } from "./data-types";

export function selfAlteration(
    property: ItemAlterationSource["property"],
    value: ItemAlterationSource["value"],
    mode: ItemAlterationSource["mode"] = "upgrade",
): RuleElementEffectSource {
    return {
        key: "RuleElement",
        rule: {
            key: "ItemAlteration",
            mode: mode,
            property: property,
            value: value,
            itemId: "{item|id}",
        },
    };
}

export function addItemBonus(
    skill: string,
    value: number,
): RuleElementEffectSource {
    return {
        key: "RuleElement",
        rule: {
            key: "FlatModifier",
            selector: skill,
            type: "item",
            value: value,
        },
    };
}

export function shieldAlteration(hp: number, hardness: number) {
    const effects = [
        {
            key: "ItemAlteration",
            property: "hp-max",
            mode: "upgrade",
            value: hp,
            itemId: "{item|id}",
        },
        {
            key: "ItemAlteration",
            property: "hardness",
            mode: "upgrade",
            value: hardness,
            itemId: "{item|id}",
        },
    ].map((r) => ({ key: "RuleElement", rule: r }));
    return [
        ...effects,
        {
            key: "InlineNote" as "InlineNote",
            text: tkey("refinement.shield.inline-note"),
            parameters: { hardness: hardness, hp: hp, bt: Math.floor(hp / 2) },
        },
    ] as MaterialEffectSource["effects"];
}

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

type RollString = number | `${number}` | `${number}d${number}` | `d${number}`;

export function damageSeries(
    levelRanges: number[][],
    damages: RollString[],
    commonParameters: Omit<Parameters<typeof addDamage>[0], "value">,
) {
    return levelRanges.map((levels, i) => ({
        ...levelRange(levels[0], levels[1]),
        effects: addDamage({
            ...commonParameters,
            value: damages[i],
        }),
    }));
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
    category?: "persistent" | "splash";
    value: RollString;
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
                category: category,
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

export function addTraits(traits: string | string[]) {
    return (Array.isArray(traits) ? traits : [traits]).map((t) =>
        selfAlteration("traits", t, "add"),
    );
}
