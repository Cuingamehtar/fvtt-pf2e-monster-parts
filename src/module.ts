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

export const MODULE_ID = "pf2e-monster-parts";

Hooks.once("init", () => {
    registerSettings();
    Hooks.once("ready", async () => {
        await createConfig();
        if (
            game.settings.get(MODULE_ID, "refresh-refined-items") &&
            game.user.isActiveGM
        ) {
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
        }
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
    });

    game.modules.get(MODULE_ID).api = {
        renderSummaryJournal,
        Material,
        MonsterPart,
        RefinedItem,
        getExtendedNPCRollOptions,
    };
});
