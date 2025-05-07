import type { DamageDiceSource, FlatModifierSource, PredicateStatement, RollNoteSource, SkillSlug } from "foundry-pf2e"

// materials
type MaterialSource = {
    key: string,
    label: string,
    monsterPredicate?: Array<PredicateStatement>
}

type WeaponRefinementSource = MaterialSource & {
    type: "refinement",
    itemPredicate: Array<PredicateStatement>,
    effects: WeaponRefinementEffectSource[]
}

type ArmorRefinementSource = MaterialSource & {
    type: "refinement",
    itemPredicate: Array<PredicateStatement>,
    effects: ArmorRefinementEffectSource[]
}

type ShieldRefinementSource = MaterialSource & {
    type: "refinement",
    itemPredicate: Array<PredicateStatement>,
    effects: ShieldRefinementEffectSource[]
}

type EquipmentRefinementSource = MaterialSource & {
    type: "refinement",
    itemPredicate: Array<PredicateStatement>,
    effects: EquipmentRefinementEffectSource[]
}
type RefinementSource = WeaponRefinementSource | ArmorRefinementSource | ShieldRefinementSource | EquipmentRefinementSource

type ImbueSource = MaterialSource & {
    type: "imbue"
    itemPredicate: Array<PredicateStatement>,
    subtype?: string,
    effects: ImbueEffectSource[]
}

type LevelRange = {
    from: number,
    to?: number
}

type MaterialEffectSource = {
    levels: LevelRange
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

type WeaponRefinementEffectSource = MaterialEffectSource & {
    effects: (PotencyEffectSource | StrikingEffectSource)[]
}
type ArmorRefinementEffectSource = MaterialEffectSource & {
    effects: (PotencyEffectSource | ResilientEffectSource)[]
}
type ShieldRefinementEffectSource = MaterialEffectSource & {
    effects: ShieldImprovementEffectSource[]
}
type EquipmentRefinementEffectSource = MaterialEffectSource & {
    effects: SkillModifierEffectSource[]
}

type RuleElementEffectSource = {
    key: "RuleElement",
    rule: DamageDiceSource | FlatModifierSource | RollNoteSource
}
type InlineNoteEffectSource = {
    key: "InlineNote",
    text: string,
    parameters?: Record<string, string | number | undefined | null>
}

type ImbueEffectSource = MaterialEffectSource & {
    effects: (RuleElementEffectSource | InlineNoteEffectSource)[]
}

export type {
    RefinementSource,
    ImbueSource,
    WeaponRefinementEffectSource,
    ArmorRefinementEffectSource,
    ShieldRefinementEffectSource,
    EquipmentRefinementEffectSource,
    RuleElementEffectSource,
    InlineNoteEffectSource
}