import { createImbueDeath } from "./death";
import { createImbueLife } from "./life";
import { createImbueFire } from "./fire";

export function createElementalStormImbues() {
    return [...createImbueDeath(), ...createImbueFire(), ...createImbueLife()];
}
