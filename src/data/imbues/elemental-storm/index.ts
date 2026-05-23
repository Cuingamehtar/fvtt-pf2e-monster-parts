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
import { createImbueHoly } from "./holy";
import { createImbueUnholy } from "./unholy";
import { createImbueBurningBarbs } from "./burning-barbs";
import { createImbueDarkArmor } from "./dark-armor";
import { createImbueEarthArmor } from "./earth-armor";
import { createImbueLifewardArmor } from "./lifeward-armor";

export function createElementalStormImbues() {
    return [
        ...createImbueAir(),
        ...createImbueBody(),
        createImbueBurningBarbs(),
        createImbueDarkArmor(),
        ...createImbueDarkness(),
        ...createImbueDeath(),
        createImbueEarthArmor(),
        ...createImbueElectricity(),
        ...createImbueFire(),
        ...createImbueForce(),
        ...createImbueHoly(),
        ...createImbueLife(),
        createImbueLifewardArmor(),
        ...createImbueMind(),
        ...createImbuePoison(),
        ...createImbueUnholy(),
    ];
}
