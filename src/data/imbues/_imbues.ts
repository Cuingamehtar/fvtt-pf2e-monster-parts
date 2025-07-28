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
        createImbueWild(),
    ];
}

/*
Chaotic, Energy Resistant, Evil, Fortification, Good, Intelligence, Lawful, Mental, Negative, Poison, Positive, Sensory, Sonic, Spell, Strength, Sturdy, Wild, Winged, Wisdom
 */
