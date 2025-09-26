import { createOriginalImbues } from "./original/_imbues";
import { MaterialData } from "../material";
import { createElementalStormImbues } from "./elemental-storm";

export function createDefaultImbues(): MaterialData[] {
    return [...createOriginalImbues(), ...createElementalStormImbues()];
}
