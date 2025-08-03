import { MODULE_ID } from "./module";
import { t } from "./utils";

export function registerSettings() {
    game.settings.register(MODULE_ID, "variant", {
        name: t("settings.variant.name") as string,
        scope: "world",
        type: String,
        config: true,
        choices: {
            light: t("settings.variant.light") as string,
            hybrid: t("settings.variant.hybrid") as string,
            full: t("settings.variant.full") as string,
        },
        default: "light",
        requiresReload: false,
    });

    /*
    game.settings.register(MODULE_ID, "groupSenses", {
        name: t("settings.groupsenses.name") as string,
        scope: "world",
        type: Boolean,
        config: true,
        default: false,
        requiresReload: false,
    });
    */

    game.settings.register(MODULE_ID, "actor-lootable", {
        name: t("settings.actor-lootable.name") as string,
        hint: t("settings.actor-lootable.hint") as string,
        scope: "world",
        type: Boolean,
        config: true,
        default: true,
        requiresReload: false,
    });

    game.settings.register(MODULE_ID, "armor-refinements", {
        name: t("settings.armor-refinements.name") as string,
        hint: t("settings.armor-refinements.hint") as string,
        type: String,
        config: true,
        choices: {
            none: t("settings.armor-refinements.none") as string,
            ask: t("settings.armor-refinements.ask") as string,
            all: t("settings.armor-refinements.all") as string,
        },
        default: "light",
        requiresReload: false,
    });
}
