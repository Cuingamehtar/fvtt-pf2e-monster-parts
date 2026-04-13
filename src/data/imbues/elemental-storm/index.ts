import { createImbueAir } from "./air";
import { createImbueDeath } from "./death";
import { createImbueLife } from "./life";
import { createImbueFire } from "./fire";
import { createImbueElectricity } from "./electricity";
import { createImbueForce } from "./force";
import { createImbueBody } from "./body";

export function createElementalStormImbues() {
    return [
        ...createImbueAir(),
        ...createImbueBody(),
        ...createImbueDeath(),
        ...createImbueElectricity(),
        ...createImbueFire(),
        ...createImbueForce(),
        ...createImbueLife(),
    ];
}
