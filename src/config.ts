import { Size } from "foundry-pf2e"
import { ImbueSource, RefinementSource } from "./data/data-types"
import { createDefaultRefinements } from "./data/refines"
import { MODULE_ID } from "./module"
import { createDefaultImbues } from "./data/imbues/_imbues"

export type MonsterPartsConfig = {
    materials: (RefinementSource | ImbueSource)[]
    itemValueThresholds: {
        weapon: number[],
        armor: number[],
        shield: number[],
        equipment: number[]
    },
    valueForMonsterLevel: number[],
    materialItem: {
        image: string
    },
    materialBulk: Record<Size, number>
}

export function createConfig() {
    const valueForMonsterLevelDefaults = {
        light: [1.5, 2.25, 3.5, 5, 7, 12, 18, 30, 45, 64, 90, 125, 175, 250, 375, 560, 810, 1250, 1875, 3000, 5000, 8750, 10000, 17500, 20000, 35000, 40000],
        hybrid: [3.5, 5, 7, 12, 18, 27, 45, 65, 100, 140, 200, 275, 390, 560, 840, 1250, 1850, 2800, 4300, 7000, 12000, 17500, 24000, 35000, 48000, 70000, 96000],
        full: [6.5, 9, 13, 22, 30, 50, 80, 125, 180, 250, 360, 500, 720, 1030, 1560, 2300, 3400, 5150, 8000, 13000, 22500, 30000, 45000, 60000, 90000, 120000, 180000]
    };
    const itemValueThersholdDefaults = {
        weapon: [20, 35, 60, 100, 160, 250, 360, 500, 700, 1000, 1400, 2000, 3000, 4500, 6500, 10000, 15000, 24000, 40000, 70000],
        armor: [20, 35, 60, 100, 160, 250, 360, 500, 700, 1000, 1400, 2000, 3000, 4500, 6500, 10000, 15000, 24000, 40000, 70000],
        shield: [10, 20, 35, 60, 100, 160, 240, 340, 470, 670, 950, 1350, 2000, 3000, 4300, 6500, 1000, 16000, 25000, 45000],
        equipment: [10, 20, 35, 60, 100, 160, 240, 340, 470, 670, 950, 1350, 2000, 3000, 4300, 6500, 1000, 16000, 25000, 45000]
    }
    const variant: ("light" | "hybrid" | "full") = game.settings.get(MODULE_ID, "variant");

    var config: MonsterPartsConfig = {
        materials: [...createDefaultRefinements(), ...createDefaultImbues()],
        itemValueThresholds: itemValueThersholdDefaults,
        valueForMonsterLevel: valueForMonsterLevelDefaults[variant],
        materialItem: { image: "systems/pf2e/icons/equipment/treasure/art-objects/lesser-art-object/inscribed-crocodile-skull.webp" },
        materialBulk: {
            tiny: 0.1,
            sm: 0.1,
            med: 1,
            lg: 2,
            huge: 4,
            grg: 8
        }
    }
    // @ts-ignore
    CONFIG[MODULE_ID] = config;
    console.log(`${MODULE_ID} | Config initialized`)
    Hooks.call(`${MODULE_ID}.configInit`);
}