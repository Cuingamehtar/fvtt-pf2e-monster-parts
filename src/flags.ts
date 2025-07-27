import { ItemPF2e } from "foundry-pf2e";
import { getConfig } from "./config";

type MaterialValue = {
    key: MaterialKey;
    value: number;
};

export type RefinedItemFlags = {
    refinement: MaterialValue;
    imbues: MaterialValue[];
};

export type MonsterPartFlags = {
    value: number;
    materials: MaterialKey[];
};

export type ModuleFlags = {
    ["monster-part"]?: MonsterPartFlags;
    ["refined-item"]?: RefinedItemFlags;
    text?: string;
};

export function getMaterialLevel(value: MaterialValue, item: ItemPF2e): number {
    const config = getConfig();
    const material = config.materials.get(value.key);
    if (!material) {
        ui.notifications.error(`Unknown material key: ${value.key}`);
        return 0;
    }
    const thresholds = config.thresholds[material.type];
    if (Object.keys(thresholds).includes(item.type)) {
        const type = item.type as "weapon" | "armor" | "shield" | "equipment";
        const thr = thresholds[type];
        const level = thr.findLastIndex((e) => e < value.value);
        return level === -1 ? 0 : level;
    }
    return 0;
}

declare module "foundry-pf2e" {
    interface ItemPF2e {
        getFlag(
            scope: "pf2e-monster-parts",
            key: "monster-part",
        ): ModuleFlags["monster-part"];
        getFlag(
            scope: "pf2e-monster-parts",
            key: "refined-item",
        ): ModuleFlags["refined-item"];
    }
}
