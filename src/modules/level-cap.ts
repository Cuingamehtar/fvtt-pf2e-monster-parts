import { MODULE_ID } from "@src/module";
import { AttachedMaterial } from "@src/material";

export class LevelCap {
    static get isEnabled() {
        return game.settings.get(MODULE_ID, "level-capped") as boolean;
    }

    static maximumLevel(material: AttachedMaterial): number | null {
        if (!this.isEnabled) return null;
        const ownerLevel = material.owningActor?.level;
        if (typeof ownerLevel !== "number") return null;
        if (material.type === "refinement") {
            return ownerLevel;
        } else {
            return material.parent.refinement.effectiveLevel.value;
        }
    }
}
