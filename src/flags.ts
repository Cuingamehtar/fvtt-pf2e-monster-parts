import { ItemPF2e } from "foundry-pf2e"
import { getConfig } from "./config"

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

export function getMaterialLevel(value: MaterialValue, item:ItemPF2e){
    const config = getConfig();
    const material = config.materials.find(m => m.key==value.key);
    if (!material){
        ui.notifications.error(`Unknown material key: ${value.key}`);
        return 0;
    }
    const thresholds = config.thresholds[material.type];
    if(!Object.keys(thresholds).includes(item.type)){
        const type = item.type as ("weapon"|"armor"|"shield"|"equipment");
        const thr = thresholds[type];
        const level = thr.findIndex(e => e < value.value);
        return level == -1 ? 20 : level;
    }
    return 0;
}