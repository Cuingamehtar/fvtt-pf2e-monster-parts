import { MaterialData } from "./material";
import { addWeaponRefinements } from "./refinements/weapon";
import { addShieldRefinements } from "./refinements/shield";
import { addArmorRefinements } from "./refinements/armor";
import { addSkillRefinements } from "./refinements/skill";

export function createDefaultRefinements(): MaterialData[] {
    return [
        ...addWeaponRefinements(),
        ...addShieldRefinements(),
        ...addSkillRefinements(),
        ...addArmorRefinements(),
    ];
}
