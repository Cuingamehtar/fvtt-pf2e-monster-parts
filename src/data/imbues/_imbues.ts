import { createImbueAcid } from "./acid";
import { createImbueBane } from "./bane";
import { createImbueCharisma } from "./charisma";
import { createImbueCold } from "./cold";
import { createImbueConstitution } from "./constitution";
import { createImbueDexterity } from "./dexterity";
import { createImbueElectricity } from "./electricity";
import { createImbueFire } from "./fire";
import { createImbueForce } from "./force";
import { createImbueFortification } from "./fortification";
import { createImbueIntelligence } from "./intelligence";
import { createImbueMental } from "./mental";
import { createImbueStrength } from "./strength";
import { createImbueWild } from "./wild";
import { createImbueWinged } from "./winged";
import { createImbueWisdom } from "./wisdom";
import { createImbuePoison } from "./poison";
import { createImbueVitality } from "./vitality";
import { createImbueEnergyResistant } from "./energy-resistant";
import { createImbueVoid } from "./void";
import { createImbueSensory } from "./sensory";

export function createDefaultImbues() {
    return [
        ...createImbueAcid(),
        ...createImbueBane(),
        createImbueCharisma(),
        ...createImbueCold(),
        createImbueConstitution(),
        createImbueDexterity(),
        ...createImbueElectricity(),
        ...createImbueEnergyResistant(),
        ...createImbueFire(),
        ...createImbueForce(),
        createImbueFortification(),
        createImbueIntelligence(),
        ...createImbueMental(),
        ...createImbuePoison(),
        createImbueSensory(),
        createImbueStrength(),
        ...createImbueVitality(),
        ...createImbueVoid(),
        createImbueWild(),
        createImbueWinged(),
        createImbueWisdom(),
    ];
}

/*
Chaotic, Evil, Good, Lawful, Sonic, Spell, Sturdy
 */
