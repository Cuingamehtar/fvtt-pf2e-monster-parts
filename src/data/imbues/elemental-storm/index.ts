import { createImbueAir } from "./air";
import { createImbueBody } from "./body";
import { createImbueBurningBarbs } from "./burning-barbs";
import { createImbueDarkArmor } from "./dark-armor";
import { createImbueDarkness } from "./darkness";
import { createImbueDeath } from "./death";
import { createImbueEarthArmor } from "./earth-armor";
import { createImbueEarth } from "./earth";
import { createImbueElectricity } from "./electricity";
import { createImbueFire } from "./fire";
import { createImbueForce } from "./force";
import { createImbueHoly } from "./holy";
import { createImbueLife } from "./life";
import { createImbueLifewardArmor } from "./lifeward-armor";
import { createImbueLight } from "./light";
import { createImbueMetal } from "./metal";
import { createImbueMind } from "./mind";
import { createImbuePoison } from "./poison";
import { createImbueSpace } from "./space";
import { createImbueTime } from "./time";
import { createImbueUnholy } from "./unholy";
import { createImbueWater } from "./water";
import { createImbueWood } from "./wood";

export function createElementalStormImbues() {
    return [
        ...createImbueAir(),
        ...createImbueBody(),
        createImbueBurningBarbs(),
        createImbueDarkArmor(),
        ...createImbueDarkness(),
        ...createImbueDeath(),
        ...createImbueEarth(),
        createImbueEarthArmor(),
        ...createImbueElectricity(),
        ...createImbueFire(),
        ...createImbueForce(),
        ...createImbueHoly(),
        ...createImbueLife(),
        ...createImbueLight(),
        createImbueLifewardArmor(),
        ...createImbueMetal(),
        ...createImbueMind(),
        ...createImbuePoison(),
        ...createImbueSpace(),
        ...createImbueTime(),
        ...createImbueUnholy(),
        ...createImbueWater(),
        ...createImbueWood(),
    ];
}
