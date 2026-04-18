import {
    DamageDiceSource,
    FlatModifierSource,
    RollNoteSource,
    RollOptionSource,
    RuleElementSource,
} from "foundry-pf2e";

type ItemAlterationSource = {
    key: "ItemAlteration";
    mode:
        | "add"
        | "downgrade"
        | "multiply"
        | "override"
        | "remove"
        | "subtract"
        | "upgrade";
    value: number | string;
    property:
        | "ac-bonus"
        | "area-size"
        | "badge-max"
        | "badge-value"
        | "bulk"
        | "category"
        | "check-penalty"
        | "damage-dice-faces"
        | "damage-dice-number"
        | "damage-type"
        | "defense-passive"
        | "dex-cap"
        | "focus-point-cost"
        | "group"
        | "hardness"
        | "hp-max"
        | "material-type"
        | "pd-recovery-dc"
        | "persistent-damage"
        | "rarity"
        | "range-increment"
        | "name"
        | "runes-potency"
        | "runes-resilient"
        | "runes-striking"
        | "strength"
        | "traits";
    itemId: string;
};

// PF2e Toolbelt ItemCast
export type ItemCastSource = {
    key: "ItemCast";
    uuid: "string";
    rank?: number;
    dc?: number;
    max?: number;
};

// Refinement Effect
type RuleElementEffectSource = {
    key: "RuleElement";
    rule:
        | DamageDiceSource
        | FlatModifierSource
        | (RollNoteSource & { key: "Note" })
        | RollOptionSource
        | ItemAlterationSource
        | SenseSource
        | ItemCastSource;
};

type SenseSource = Omit<RuleElementSource, "key"> & {
    key: "Sense";
    acuity?: "precise" | "imprecise" | "vague";
    selector: string;
    range?: number | string;
};

export type { RuleElementEffectSource, ItemAlterationSource };
