import { createConfig } from "./config";
import { createRefinedItem } from "./item";
import { getExtendedItemRollOptions, getExtendedNPCRollOptions } from "./itemUtil";
import { createMaterial } from "./material";
import { registerSettings } from "./settings";

export const MODULE_ID = "pf2e-monster-parts";

Hooks.once("init", () => {
    registerSettings();
    Hooks.once("i18nInit", () => createConfig());

    // @ts-ignore
    game[MODULE_ID] = { createMaterial, createRefinedItem, getExtendedItemRollOptions, getExtendedNPCRollOptions }
});