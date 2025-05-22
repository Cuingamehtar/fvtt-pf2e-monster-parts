import { createImbueAcid } from "./acid";
import { createImbueBane } from "./bane";
import { createImbueCharisma } from "./charisma";
import { createImbueCold } from "./cold";
import { createImbueConstitution } from "./constitution";
import { createImbueDexterity } from "./dexterity";
import { createImbueElectricity } from "./electricity";
import { createImbueFire } from "./fire";
import { createImbueWild } from "./wild";

export function createDefaultImbues(){
    return [
        ...createImbueAcid(),
        ...createImbueBane(),
        createImbueCharisma(),
        ...createImbueCold(),
        createImbueConstitution(),
        createImbueDexterity(),
        ...createImbueElectricity(),
        ...createImbueFire(),
        createImbueWild(),
    ]
}