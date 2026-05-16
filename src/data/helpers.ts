import {
    Abilities,
    DAMAGE_TYPES,
    PredicateStatement,
    SkillSlug,
} from "foundry-pf2e";
import { ItemAlterationSource } from "./data-types";
import { HeaderLabel, MaterialData, MaterialEffect } from "./material";
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
        hideIfDisabled,
        critical,
    }: {
        type?: ValueOf<typeof DAMAGE_TYPES>;
        category?: "persistent" | "splash";
        value: RollString;
        label: I18nKey | I18nString;
        predicate?: PredicateStatement[];
        selector?: string;
        hideIfDisabled?: boolean;
        critical?: boolean;
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
                    selector: selector ?? Selector.ItemDamage,
                    damageType: type,
                    damageCategory: category,
                    value: value ?? 1,
                    predicate,
                    label: label as string,
                    hideIfDisabled,
                    critical: critical,
                },
            };
        } else {
            const m = value.match(/(\d+)?(d\d+)/);
            return {
                type: "RuleElement",
                rule: {
                    key: "DamageDice",
                    selector: selector ?? Selector.ItemDamage,
                    damageType: type,
                    category: category,
                    dieSize: m?.[2] ?? "d4",
                    diceNumber: m?.[1] ?? 1,
                    predicate,
                    label: label as string,
                    hideIfDisabled,
                    critical,
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
            max: max ?? 1,
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
    return Array.fromRange(values.length)
        .map((i) => ({
            levelMin: levels[i],
            levelMax: levels[i + 1] ? levels[i + 1] - 1 : undefined,
            value: values[i],
        }))
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
    return Array.fromRange(values.length)
        .map((i) => ({
            levelMin: levels[i],
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

function sequentialData<T>(...arr: Record<string, T>[]) {
    return arr.reduce((acc: Record<string, T>[], d) => {
        const e = { ...(acc[acc.length - 1] ?? {}), ...d };
        acc.push(e);
        return acc;
    }, []);
}

function addEffects(effects: MaterialEffect | MaterialEffect[]) {
    return (m: MaterialData) => {
        if (typeof m.effects === "undefined") m.effects = [];
        if (!Array.isArray(effects)) effects = [effects];
        for (const effect of effects) {
            m.effects.push(effect);
        }
        return m;
    };
}
function addLabels(labels: HeaderLabel | HeaderLabel[]) {
    return (m: MaterialData) => {
        if (typeof m.header.labels === "undefined") m.header.labels = [];
        if (!Array.isArray(labels)) labels = [labels];
        for (const label of labels) {
            m.header.labels.push(label);
        }
        return m;
    };
}

function addGroup({
    labels,
    effects,
}: {
    labels?: Parameters<typeof addLabels>[0];
    effects?: Parameters<typeof addEffects>[0];
}) {
    return (m: MaterialData) => {
        if (labels) addLabels(labels)(m);
        if (effects) addEffects(effects)(m);
        return m;
    };
}

export enum Selector {
    ItemAttack = "{item|id}-attack",
    ItemDamage = "{item|id}-damage",
    UnarmedAttack = "unarmed-attack",
    UnarmedDamage = "unarmed-damage",
}

export const helpers = {
    damage,
    shield,
    leveledEffects,
    leveledLabels,
    sequentialData,
    spellActivation,
    cantripActivation,
    addEffects,
    addLabels,
    addGroup,
};
