import { moduleId, t } from "./utils.js";

export function registerSettings(){
    game.settings.register(moduleId, "valueVariant",{
        name: t("Settings.Variant.Name"),
        scope: "world",
        type: String,
        choices: {
            light: t("Settings.Variant.Light"),
            hybrid: t("Settings.Variant.Hybrid"),
            full: t("Settings.Variant.Full")
        },
        default: "light",
		requiresReload: false
    });

    game.settings.register(moduleId, "groupSenses",{
        name: t("Settings.GroupSenses.Name"),
        scope: "world",
        type: Boolean,
        default: false,
		requiresReload: false
    })
}