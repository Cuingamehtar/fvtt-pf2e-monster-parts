import { createConfig } from "./config";
import { registerSettings } from "./settings";
import { MonsterPart } from "./monster-part";
import { RefinedItem } from "./refined-item";
import { renderSummaryJournal } from "./summary-journal";
import { Material } from "./material";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { AutomaticRefinementProgression } from "./automatic-refinement-progression";
import { Wrappers } from "./wrappers";
import { ModuleHooks } from "./hooks";
import { ActorPF2e, TokenPF2e } from "foundry-pf2e";

export const MODULE_ID = "pf2e-monster-parts";

Hooks.once("init", () => {
    registerSettings();
    Hooks.once("ready", async () => {
        await createConfig();

        AutomaticRefinementProgression.registerHooks();
        if (
            game.settings.get(MODULE_ID, "handle-monster-parts-selling") !==
            "treasure"
        )
            Wrappers.patchSellAllTreasure();
        Wrappers.registerInlineNotes();
        Wrappers.extendDerivedData();
        Wrappers.extendItemRollOptions();
        ModuleHooks.registerAllHandlers();

        // refresh item data  for all actors
        const refreshedItems: string[] = [];
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
                    (MonsterPart.hasMonsterPartData(item) ||
                        RefinedItem.hasRefinedItemData(item)) &&
                    !refreshedItems.includes(item.id)
                ) {
                    item.prepareDerivedData();
                    refreshedItems.push(item.id);
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
