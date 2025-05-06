import { createConfig } from "./config";
import { createRefinedItem } from "./item";
import { createMaterial } from "./material";
import { registerSettings } from "./settings";

export const MODULE_ID = "pf2e-monster-parts";

Hooks.once("init", () => {
    registerSettings();
    createConfig();

    // @ts-ignore
    game[MODULE_ID] = {createMaterial, createRefinedItem}
});