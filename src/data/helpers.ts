import {
    Abilities,
    DAMAGE_TYPES,
    PredicateStatement,
    SkillSlug,
} from "foundry-pf2e";
import { ItemAlterationSource } from "./data-types";
import { HeaderLabel, MaterialEffect } from "./material";
import { RollString } from "../../types/global";
import { RuleElementEffect } from "./effect-handlers/rule-element";

export function selfAlteration(
    property: ItemAlterationSource["property"],
    value: ItemAlterationSource["value"],
    mode: ItemAlterationSource["mode"] = "upgrade",
): Omit<RuleElementEffect, "levelMin" | "levelMax"> {
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
    ): Omit<RuleElementEffect, "levelMin" | "levelMax"> {
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
    ): Omit<RuleElementEffect, "levelMin" | "levelMax"> {
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
        selector,
    }: {
        type?: ValueOf<typeof DAMAGE_TYPES>;
        category?: "persistent" | "splash";
        value: RollString;
        label: I18nKey | I18nString;
        predicate?: PredicateStatement[];
        selector?: string;
    }): Omit<RuleElementEffect, "levelMin" | "levelMax"> {
        if (
            typeof value === "undefined" ||
            typeof value === "number" ||
            !isNaN(Number(value))
        ) {
            return {
                type: "RuleElement",
                rule: {
                    key: "FlatModifier",
                    selector: selector ?? "{item|_id}-damage",
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
                    selector: selector ?? "{item|_id}-damage",
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
        key,
    }: {
        type?: string;
        category?: "persistent" | "splash";
        value: RollString;
        key?: I18nKey;
    }): Omit<HeaderLabel, "levelMin" | "levelMax"> {
        type = type ?? "untyped";
        const partialKey =
            (category ?? "") +
            (category ? type[0].toUpperCase() + type.slice(1) : type);
        return {
            text: {
                type: "key",
                key: key ?? "pf2e-monster-parts.damage.strikes",
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

function spellActivation({
    uuid,
    rank,
    dc,
    max,
}: {
    uuid: `Compendium.${string}.Item.${string}`;
    rank?: number;
    dc?: number;
    max?: number;
    tradition?: "arcane" | "divine" | "occult" | "primal";
}) {
    return {
        type: "RuleElement",
        rule: {
            key: "ItemCast",
            uuid,
            max,
            dc,
            rank,
        },
    } as Omit<RuleElementEffect, "levelMin" | "levelMax">;
}

function cantripActivation({
    uuid,
}: {
    uuid: Parameters<typeof spellActivation>[0]["uuid"];
    tradition?: "arcane" | "divine" | "occult" | "primal";
}) {
    const ranks = Array.fromRange(9, 1);
    const levels = ranks.map((r) => r * 2 - 1);
    levels[0] = 2;
    return helpers.leveledEffects(levels, ranks, (rank) =>
        spellActivation({ uuid, rank }),
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
        .filter((e) => typeof e.value !== "undefined")
        .map(
            ({ levelMin, levelMax, value }) =>
                ({
                    ...f(value),
                    levelMin,
                    levelMax,
                }) as MaterialEffect,
        );
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

function sequentialData(arr: Record<string, any>[]) {
    return arr.reduce((acc: Record<string, any>[], d) => {
        const e = { ...(acc[acc.length - 1] ?? {}), ...d };
        acc.push(e);
        return acc;
    }, []);
}

export const helpers = {
    damage,
    shield,
    leveledEffects,
    leveledLabels,
    sequentialData,
    spellActivation,
    cantripActivation,
};
