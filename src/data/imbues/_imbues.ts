import { createImbueAcid } from "./acid";
import { createImbueBane } from "./bane";
import { createImbueCharisma } from "./charisma";
import { createImbueCold } from "./cold";
import { createImbueConstitution } from "./constitution";
import { createImbueDexterity } from "./dexterity";
import { createImbueElectricity } from "./electricity";
import { createImbueFire } from "./fire";
import { createImbueWild } from "./wild";
import { createImbueForce } from "./force";
import { createImbueMental } from "./mental";
import { createImbueWinged } from "./winged";
import { createImbueFortification } from "./fortification";
import { createImbueIntelligence } from "./intelligence";
import { createImbueStrength } from "./strength";

export function createDefaultImbues() {
    return [
        ...createImbueAcid(),
        ...createImbueBane(),
        createImbueCharisma(),
        ...createImbueCold(),
        createImbueConstitution(),
        createImbueDexterity(),
        ...createImbueElectricity(),
        ...createImbueFire(),
        ...createImbueForce(),
        createImbueFortification(),
        createImbueIntelligence(),
        ...createImbueMental(),
        createImbueStrength(),
        createImbueWild(),
        createImbueWinged(),
    ];
}

/*
Chaotic, Energy Resistant, Evil, Good, Lawful, Negative, Poison, Positive, Sensory, Sonic, Spell, Sturdy,  Wisdom
 */
