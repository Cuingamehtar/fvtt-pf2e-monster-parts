import { MODULE_ID } from "./module";
import { t } from "./utils";

export function registerSettings() {
    game.settings.register(MODULE_ID, "variant", {
        name: t("settings.variant.name") as string,
        scope: "world",
        type: new foundry.data.fields.StringField({
            choices: {
                light: t("settings.variant.light") as string,
                hybrid: t("settings.variant.hybrid") as string,
                full: t("settings.variant.full") as string,
            },
            nullable: false,
            blank: false,
            initial: "light",
            required: true,
        }),
        config: true,
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
        type: new foundry.data.fields.StringField({
            choices: {
                none: t("settings.armor-refinements.none") as string,
                all: t("settings.armor-refinements.all") as string,
            },
            nullable: false,
            blank: false,
            initial: "all",
            required: true,
        }),
        config: true,
        requiresReload: false,
    });

    game.settings.register(MODULE_ID, "refresh-refined-items", {
        name: t("settings.refresh-refined-items.name") as string,
        hint: t("settings.refresh-refined-items.hint") as string,
        type: Boolean,
        config: true,
        default: true,
        requiresReload: false,
    });
}
