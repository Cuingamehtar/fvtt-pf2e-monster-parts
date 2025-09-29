import { ActorPF2e, ItemPF2e } from "foundry-pf2e";
import { RefinedItem } from "./refined-item";
import { MODULE_ID } from "./module";
import { Material } from "./material";

export class AutomaticRefinementProgression {
    static get isEnabled() {
        return game.settings.get(MODULE_ID, "automatic-refinement-progression");
    }

    static registerHooks() {
        if (!game.user.isActiveGM) return;
        if (!AutomaticRefinementProgression.isEnabled) return;

        Hooks.on("createItem", (item: ItemPF2e) => {
            if (!item.isOfType("physical")) return;
            if (!RefinedItem.hasRefinedItemData(item)) return;

            const refinedItem = new RefinedItem(item);
            refinedItem.updateItem();
        });

        Hooks.on("updateActor", (actor: ActorPF2e, changes) => {
            if (!actor.isOfType("character")) return;

            const levelChanged =
                typeof changes.system?.details?.level?.value !== "undefined";
            if (levelChanged) {
                actor.items
                    .filter(
                        (i) =>
                            i.isOfType("physical") &&
                            RefinedItem.hasRefinedItemData(i),
                    )
                    .forEach((i) => {
                        new RefinedItem(i).updateItem();
                    });
            }
        });
    }

    static async adjustRefinementValue(item: RefinedItem) {
        const parent = item.item.parent;
        if (parent && parent.isOfType("character")) {
            const parentLevel = parent.system.details.level.value;
            const refinementValue = Material.fromKey(
                item.getFlag().refinement.key,
            )?.getThresholdForLevel(item, parentLevel);
            if (typeof refinementValue === "undefined") return;
            return item.item.update({
                "flags.pf2e-monster-parts.refined-item.refinement.value":
                    refinementValue,
            });
        }
    }
}
