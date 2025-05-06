type MaterialValue = {
    key:string,
    value:number
}

export type RefinedItemFlags = {
    refinement: MaterialValue,
    imbues: MaterialValue[]
}

export type MonsterPartFlags = {
    value:number,
    materials: string[]
}

export type ModuleFlags = {
    monsterPart?: MonsterPartFlags,
    refinedItem?: RefinedItemFlags
};