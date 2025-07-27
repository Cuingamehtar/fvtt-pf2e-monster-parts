import { MODULE_ID } from "./module";
import { t } from "./utils";

export function registerSettings() {
    game.settings.register(MODULE_ID, "variant", {
        name: t("Settings.Variant.Name") as string,
        scope: "world",
        type: String,
        config: true,
        choices: {
            light: t("Settings.Variant.Light") as string,
            hybrid: t("Settings.Variant.Hybrid") as string,
            full: t("Settings.Variant.Full") as string,
        },
        default: "light",
        requiresReload: false,
    });

    /*
    game.settings.register(MODULE_ID, "groupSenses", {
        name: t("Settings.GroupSenses.Name") as string,
        scope: "world",
        type: Boolean,
        config: true,
        default: false,
        requiresReload: false,
    });
    */

    game.settings.register(MODULE_ID, "actor-lootable", {
        name: t("Settings.ActorLootable.Name") as string,
        hint: t("Settings.ActorLootable.Hint") as string,
        scope: "world",
        type: Boolean,
        config: true,
        default: true,
        requiresReload: false,
    });

    game.settings.register(MODULE_ID, "armor-refinements", {
        name: t("Settings.ArmorRefinements.Name") as string,
        hint: t("Settings.ArmorRefinements.Hint") as string,
        type: String,
        config: true,
        choices: {
            none: t("Settings.ArmorRefinements.None") as string,
            ask: t("Settings.ArmorRefinements.Ask") as string,
            all: t("Settings.ArmorRefinements.All") as string,
        },
        default: "light",
        requiresReload: false,
    });
}
