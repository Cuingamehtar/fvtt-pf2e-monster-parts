import { createImbueAcid } from "./acid";
import { createImbueBane } from "./bane";
import { createImbueCharisma } from "./charisma";
import { createImbueCold } from "./cold";
import { createImbueConstitution } from "./constitution";
import { createImbueDexterity } from "./dexterity";
import { createImbueFortification } from "./fortification";
import { createImbueIntelligence } from "./intelligence";
import { createImbueMental } from "./mental";
import { createImbueStrength } from "./strength";
import { createImbueWild } from "./wild";
import { createImbueWinged } from "./winged";
import { createImbueWisdom } from "./wisdom";
import { createImbuePoison } from "./poison";
import { createImbueEnergyResistant } from "./energy-resistant";
import { createImbueSensory } from "./sensory";
import { createImbueSonic } from "./sonic";
import { createImbueSturdy } from "./sturdy";

export function createOriginalImbues() {
    return [
        ...createImbueAcid(),
        ...createImbueBane(),
        createImbueCharisma(),
        ...createImbueCold(),
        createImbueConstitution(),
        createImbueDexterity(),
        // ...createImbueElectricity(),
        ...createImbueEnergyResistant(),
        // ...createImbueFire(),
        //...createImbueForce(),
        createImbueFortification(),
        createImbueIntelligence(),
        ...createImbueMental(),
        ...createImbuePoison(),
        createImbueSensory(),
        ...createImbueSonic(),
        createImbueSturdy(),
        createImbueStrength(),
        //...createImbueVitality(),
        //...createImbueVoid(),
        createImbueWild(),
        createImbueWinged(),
        createImbueWisdom(),
    ];
}

/*
Missing
Chaotic, Evil, Good, Lawful, Spell
 */
