import { Abilities, PredicateStatement, SkillSlug } from "foundry-pf2e";
import { ItemAlterationSource } from "./data-types";
import { HeaderLabel, MaterialData, MaterialEffect } from "./material";
import { RollString } from "../types";

export function selfAlteration(
    property: ItemAlterationSource["property"],
    value: ItemAlterationSource["value"],
    mode: ItemAlterationSource["mode"] = "upgrade",
): Omit<MaterialData["effects"][0], "levelMin" | "levelMax"> {
    return {
        type: "RuleElement",
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
): Omit<MaterialEffect, "levelMin" | "levelMax"> {
    return {
        type: "RuleElement",
        rule: {
            key: "FlatModifier",
            selector: skill,
            type: "item",
            value: value,
        },
    };
}
export const shield = {
    label: function (
        hp: number,
        hardness: number,
    ): Omit<HeaderLabel, "levelMin" | "levelMax"> {
        return {
            text: {
                type: "key",
                key: "pf2e-monster-parts.data.refinement.shield.inline-note",
                parameters: {
                    hardness: String(hardness),
                    hp: String(hp),
                    bt: String(Math.floor(hp / 2)),
                },
            },
        };
    },
    effectHP: function (
        hp: number,
    ): Omit<MaterialEffect, "levelMin" | "levelMax"> {
        return {
            type: "RuleElement",
            rule: {
                key: "ItemAlteration",
                property: "hp-max",
                mode: "upgrade",
                value: hp,
                itemId: "{item|id}",
            },
        };
    },
    effectHardness: function (
        hardness: number,
    ): Omit<MaterialEffect, "levelMin" | "levelMax"> {
        return {
            type: "RuleElement",
            rule: {
                key: "ItemAlteration",
                property: "hardness",
                mode: "upgrade",
                value: hardness,
                itemId: "{item|id}",
            },
        };
    },
};

export function levelRange(from: number, to?: number) {
    return { levelMin: from, levelMax: to };
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

const damage = {
    effect: function ({
        type,
        category,
        value,
        label,
        predicate,
    }: {
        type?: string;
        category?: "persistent" | "splash";
        value: RollString;
        label: I18nKey | I18nString;
        predicate?: PredicateStatement[];
    }): Omit<MaterialEffect, "levelMin" | "levelMax"> {
        if (typeof value === "undefined" || typeof value === "number") {
            return {
                type: "RuleElement",
                rule: {
                    key: "FlatModifier",
                    selector: "{item|_id}-damage",
                    damageType: type,
                    damageCategory: category,
                    value: value ?? 1,
                    predicate,
                    label: label as string,
                },
            };
        } else {
            const m = value.match(/(\d+)?(d\d+)/);
            return {
                type: "RuleElement",
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
            };
        }
    },
    label: function ({
        type,
        category,
        value,
    }: {
        type?: string;
        category?: "persistent" | "splash";
        value: RollString;
    }): Omit<HeaderLabel, "levelMin" | "levelMax"> {
        type = type ?? "untyped";
        const partialKey =
            (category ?? "") +
            (category ? type[0].toUpperCase() + type.slice(1) : type);
        return {
            text: {
                type: "key",
                key: "pf2e-monster-parts.damage.strikes",
                parameters: {
                    damage: {
                        type: "key",
                        key: `pf2e-monster-parts.damage.type.${partialKey}` as I18nKey,
                        parameters: {
                            value: value,
                        },
                    },
                },
            },
            sort:
                category == "persistent" ? -4 : category == "splash" ? -3 : -5,
        };
    },
};

export function addTraits(traits: string | string[]) {
    return (Array.isArray(traits) ? traits : [traits]).map((t) =>
        selfAlteration("traits", t, "add"),
    );
}

function leveledEffects<T>(
    levels: number[],
    values: T[],
    f: (v: T) => Omit<MaterialEffect, "levelMin" | "levelMax">,
): MaterialEffect[] {
    return levels
        .map((levelMin, i) => ({
            levelMin,
            levelMax: levels[i + 1] ? levels[i + 1] - 1 : undefined,
            value: values[i],
        }))
        .filter((e) => e.value)
        .map(({ levelMin, levelMax, value }) => ({
            ...f(value),
            levelMin,
            levelMax,
        }));
}

function leveledLabels<T>(
    levels: number[],
    values: T[],
    f: (v: T) => Omit<HeaderLabel, "levelMin" | "levelMax">,
): HeaderLabel[] {
    return levels
        .map((levelMin, i) => ({
            levelMin,
            levelMax: levels[i + 1] ? levels[i + 1] - 1 : undefined,
            value: values[i],
        }))
        .filter((e) => e.value)
        .map(({ levelMin, levelMax, value }) => ({
            ...f(value),
            levelMin,
            levelMax,
        }));
}

export const helpers = {
    damage,
    shield,
    leveledEffects,
    leveledLabels,
};
