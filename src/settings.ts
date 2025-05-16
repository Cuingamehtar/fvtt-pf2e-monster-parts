import { MODULE_ID } from "./module";
import { t } from "./utils";


export function registerSettings(){
    game.settings.register(MODULE_ID, "variant",{
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

    game.settings.register(MODULE_ID, "groupSenses",{
        name: t("Settings.GroupSenses.Name"),
        scope: "world",
        type: Boolean,
        default: false,
		requiresReload: false
    });

    game.settings.register(MODULE_ID, "actorLootable", {
        name:t("Settings.ActorLootable.Name"),
        hint: t("Settings.ActorLootable.Hint"),
        scope: "world",
        type:Boolean,
        default:true,
        requiresReload:false
    });
}