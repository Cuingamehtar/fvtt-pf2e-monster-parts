import { createImbueDeath } from "./death";
import { createImbueLife } from "./life";

export function createElementalStormImbues() {
    return [...createImbueDeath(), ...createImbueLife()];
}
