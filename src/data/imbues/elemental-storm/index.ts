import { createImbueAir } from "./air";
import { createImbueDeath } from "./death";
import { createImbueLife } from "./life";
import { createImbueFire } from "./fire";
import { createImbueElectricity } from "./electricity";
import { createImbueForce } from "./force";
import { createImbueBody } from "./body";
import { createImbuePoison } from "./poison";
import { createImbueMind } from "./mind";
import { createImbueDarkness } from "./darkness";

export function createElementalStormImbues() {
    return [
        ...createImbueAir(),
        ...createImbueBody(),
        ...createImbueDarkness(),
        ...createImbueDeath(),
        ...createImbueElectricity(),
        ...createImbueFire(),
        ...createImbueForce(),
        ...createImbueLife(),
        ...createImbueMind(),
        ...createImbuePoison(),
    ];
}
