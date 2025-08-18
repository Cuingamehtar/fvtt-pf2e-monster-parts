import {
    DamageDiceSource,
    FlatModifierSource,
    PredicateStatement,
    RollNoteSource,
    RollOptionSource,
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
    value: number;
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
        | "potency"
        | "resilient"
        | "strength"
        | "striking";
    itemId: string;
};
// materials
type MaterialSource = {
    key: MaterialKey;
    label: I18nKey | I18nString;
    flavor?: I18nKey | I18nString;
    monsterPredicate?: PredicateStatement[];
};

type RefinementSource = MaterialSource & {
    type: "refinement";
    itemPredicate: PredicateStatement[];
    effects: MaterialEffectSource[];
};

type ImbueSource = MaterialSource & {
    type: "imbue";
    itemPredicate: PredicateStatement[];
    subtype?: string;
    effects: MaterialEffectSource[];
};

type LevelRange = {
    from: number;
    to?: number;
};

// Refinement Effect
type RuleElementEffectSource = {
    key: "RuleElement";
    rule:
        | DamageDiceSource
        | FlatModifierSource
        | RollNoteSource
        | RollOptionSource
        | ItemAlterationSource;
};

type InlineNoteEffectSource = {
    key: "InlineNote";
    predicate?: PredicateStatement[];
} & {
    text: I18nKey | I18nString;
    parameters?: Record<string, string | number | null | undefined>;
};

type MaterialEffectSource = {
    levels: LevelRange;
    effects: (RuleElementEffectSource | InlineNoteEffectSource)[];
};

export type {
    RefinementSource,
    ImbueSource,
    RuleElementEffectSource,
    InlineNoteEffectSource,
    MaterialEffectSource,
    ItemAlterationSource,
};
