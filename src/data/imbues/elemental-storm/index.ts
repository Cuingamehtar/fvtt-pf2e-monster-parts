import { createImbueDeath } from "./death";
import { createImbueLife } from "./life";
import { createImbueFire } from "./fire";
import { createImbueElectricity } from "./electricity";
import { createImbueForce } from "./force";

export function createElementalStormImbues() {
    return [
        ...createImbueDeath(),
        ...createImbueElectricity(),
        ...createImbueFire(),
        ...createImbueForce(),
        ...createImbueLife(),
    ];
}
