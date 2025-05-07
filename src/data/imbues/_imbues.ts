import { createImbueAcid } from "./acid";
import { createImbueBane } from "./bane";
import { createImbueCharisma } from "./charisma";

export function createDefaultImbues(){
    return [
        ...createImbueAcid(),
        ...createImbueBane(),
        createImbueCharisma()
    ]
}