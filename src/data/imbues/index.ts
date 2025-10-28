import { createOriginalImbues } from "./original/_imbues";
import { MaterialData } from "../material";
import { createElementalStormImbues } from "./elemental-storm";
import { createStrangeAndUnusualImbues } from "./strange-and-unusual";

export function createDefaultImbues(): MaterialData[] {
    return [
        ...createOriginalImbues(),
        ...createStrangeAndUnusualImbues(),
        ...createElementalStormImbues(),
    ];
}
