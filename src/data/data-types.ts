import type {
    DamageDiceSource,
    FlatModifierSource,
    PredicateStatement,
    RollNoteSource,
    RollOptionSource,
    SkillSlug
} from "foundry-pf2e";


// materials
type MaterialSource = {
    key: string,
    label: I18nKey | I18nString,
    monsterPredicate?: PredicateStatement[]
}

type RefinementSource = MaterialSource & {
    type: "refinement",
    itemPredicate: PredicateStatement[],
    effects: MaterialEffectSource[]
}

type ImbueSource = MaterialSource & {
    type: "imbue"
    itemPredicate: PredicateStatement[],
    subtype?: string,
    effects: MaterialEffectSource[]
}

type LevelRange = {
    from: number,
    to?: number
}

// Refinement Effect
type PotencyEffectSource = {
    key: "ItemPotency",
    value: number
}
type StrikingEffectSource = {
    key: "WeaponStriking",
    value: number
}

type ResilientEffectSource = {
    key: "ArmorResilient",
    value: number
}

type ShieldImprovementEffectSource = {
    key: "ShieldImprovement",
    hardness: number,
    hp: number
}

type SkillModifierEffectSource = {
    key: "SkillModifier",
    skill: SkillSlug | "perception",
    value: number
}

type RuleElementEffectSource = {
    key: "RuleElement",
    rule: DamageDiceSource | FlatModifierSource | RollNoteSource | RollOptionSource
}

type InlineNoteEffectSource = {
    key: "InlineNote",
} &
    ({ text: I18nString } |
        {
            text: I18nKey,
            parameters?: Record<string, string | number | null | undefined>
        })

type MaterialEffectSource = {
    levels: LevelRange,
    effects: (PotencyEffectSource | StrikingEffectSource | ResilientEffectSource | ShieldImprovementEffectSource | RuleElementEffectSource | InlineNoteEffectSource | SkillModifierEffectSource)[]
}

export type {
    RefinementSource,
    ImbueSource,
    RuleElementEffectSource,
    InlineNoteEffectSource,
    MaterialEffectSource
};