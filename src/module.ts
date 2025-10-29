import { createConfig } from "./config";
import { registerSettings } from "./settings";
import { MonsterPart } from "./monster-part";
import { RefinedItem } from "./refined-item";
import { renderSummaryJournal } from "./summary-journal";
import { Material } from "./material";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { registerEndCombatDialog } from "./app/after-combat-dialog";
import { AutomaticRefinementProgression } from "./automatic-refinement-progression";
import { Wrappers } from "./wrappers";
import { ModuleHooks } from "./hooks";
import { ActorPF2e, TokenPF2e } from "foundry-pf2e";
import Scene from "foundry-pf2e/foundry/client/documents/scene";

export const MODULE_ID = "pf2e-monster-parts";

Hooks.once("init", () => {
    registerSettings();
    Hooks.once("ready", async () => {
        await createConfig();

        registerEndCombatDialog();
        AutomaticRefinementProgression.registerHooks();
        if (
            game.settings.get(MODULE_ID, "handle-monster-parts-selling") !==
            "treasure"
        )
            Wrappers.patchSellAllTreasure();
        Wrappers.registerInlineNotes();
        Wrappers.extendDerivedData();
        ModuleHooks.registerAllHandlers();

        // update refined item data for actors in the actor list
        for (const actor of game.actors) {
            for (const item of actor.items) {
                if (
                    item.isOfType("physical") &&
                    RefinedItem.hasRefinedItemData(item)
                ) {
                    const refinedItem = new RefinedItem(item);
                    refinedItem.updateItem();
                }
            }
        }

        // refresh monster parts value for all actors
        [
            ...game.actors.values(),
            ...game.scenes
                .values()
                .flatMap((sc: Scene) =>
                    sc.tokens.values().map((t: TokenPF2e) => t.actor),
                ),
        ].forEach((actor: ActorPF2e) => {
            actor.items.forEach((item) => {
                if (
                    item.isOfType("physical") &&
                    MonsterPart.hasMonsterPartData(item) &&
                    item.price.value.copperValue === 0
                ) {
                    item.prepareDerivedData();
                }
            });
        });
    });

    game.modules.get(MODULE_ID).api = {
        renderSummaryJournal,
        Material,
        MonsterPart,
        RefinedItem,
        getExtendedNPCRollOptions,
    };
});
