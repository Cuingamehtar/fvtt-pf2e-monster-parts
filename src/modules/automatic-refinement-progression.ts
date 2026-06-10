import { CharacterPF2e } from "foundry-pf2e";
import { RefinedItem } from "../refined-item";
import { MODULE_ID } from "../module";

export class AutomaticRefinementProgression {
    static get isEnabled() {
        return game.settings.get(
            MODULE_ID,
            "automatic-refinement-progression",
        ) as boolean;
    }

    static effectiveRefinementValue(item: RefinedItem, owner: CharacterPF2e) {
        const level = owner.system.details.level.value;
        const pct = Math.clamp(owner.system.details.xp.pct / 100, 0, 1);

        const m = item.refinement;
        const thresholdCurrent = m.getThresholdForLevel(level);
        const thresholdNext = m.getThresholdForLevel(level + 1);
        return thresholdCurrent
            .add(thresholdNext.sub(thresholdCurrent).mul(pct))
            .map(Math.floor);
    }
}
