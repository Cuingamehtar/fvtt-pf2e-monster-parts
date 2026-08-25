import { MaterialData } from "@data/material";
import { addWeaponRefinements } from "./weapon";
import { addShieldRefinements } from "./shield";
import { addArmorRefinements } from "./armor";
import { addSkillRefinements } from "./skill";

export function createDefaultRefinements(): MaterialData[] {
    return [
        ...addWeaponRefinements(),
        ...addShieldRefinements(),
        ...addSkillRefinements(),
        ...addArmorRefinements(),
    ];
}
