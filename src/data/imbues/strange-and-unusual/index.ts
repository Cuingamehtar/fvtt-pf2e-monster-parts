import { createImbueSpiked } from "@data/imbues/strange-and-unusual/spiked";
import { createImbueMirrored } from "@data/imbues/strange-and-unusual/mirrored";

export function createStrangeAndUnusualImbues() {
    return [
        // armor
        createImbueSpiked(),
        // shield
        createImbueMirrored(),
        // weapon
        // createImbueElongating(),
        // ...createImbueLight(),
        // createImbueThrowing(),
        // createImbueWater(),
        // createImbueWood()
    ];
}
