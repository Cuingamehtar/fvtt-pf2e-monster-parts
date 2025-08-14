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
        createImbueStrength(),
        ...createImbueVitality(),
        createImbueWild(),
        createImbueWinged(),
        createImbueWisdom(),
    ];
}

/*
Chaotic, Energy Resistant, Evil, Good, Lawful, Negative, Positive, Sensory, Sonic, Spell, Sturdy
 */
