import { createConfig } from "./config";
import { registerSettings } from "./settings";
import { MonsterPart } from "./monster-part";
import { RefinedItem } from "./refined-item";
import { Wrappers } from "./wrappers";
import { ModuleHooks } from "./hooks";
import { ActorPF2e, ScenePF2e } from "foundry-pf2e";
import { registerSF2eUuidRedirects } from "@src/uuid-redirect";
import { API } from "@src/api";

export const MODULE_ID = "pf2e-monster-parts";

Hooks.once("init", () => {
    registerSettings();
    Hooks.once("ready", async () => {
        await createConfig();

        if (
            game.settings.get(MODULE_ID, "handle-monster-parts-selling") !==
            "treasure"
        )
            Wrappers.patchSellAllTreasure();
        Wrappers.registerInlineNotes();
        Wrappers.extendDerivedData();
        Wrappers.extendItemRollOptions();
        ModuleHooks.registerAllHandlers();

        // DynamicStyles.registerDragging();

        // refresh item data  for all actors
        if (game.user.isActiveGM) {
            const refreshedItems: string[] = [];
            [
                ...game.actors.values(),
                ...game.scenes.values().flatMap((sc: ScenePF2e) => {
                    return sc.tokens
                        .values()
                        .map((t) => t.actor as ActorPF2e | undefined);
                }),
            ].forEach((actor) => {
                actor?.items.forEach((item) => {
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
        }
    });
    if (game.system.id === "sf2e") {
        Hooks.once("ready", registerSF2eUuidRedirects);
    }

    (
        game.modules.get(MODULE_ID) as ReturnType<typeof game.modules.get> & {
            api: API;
        }
    ).api = API;
});
