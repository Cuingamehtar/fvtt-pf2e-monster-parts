import { MODULE_ID } from "./module";
import { t, tkey } from "./utils";

export function registerSettings() {
    game.settings.register(MODULE_ID, "variant", {
        name: tkey("settings.variant.name") as string,
        scope: "world",
        type: new foundry.data.fields.StringField({
            choices: {
                light: tkey("settings.variant.light") as string,
                hybrid: tkey("settings.variant.hybrid") as string,
                full: tkey("settings.variant.full") as string,
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
        name: tkey("settings.actor-lootable.name") as string,
        hint: tkey("settings.actor-lootable.hint") as string,
        scope: "world",
        type: Boolean,
        config: true,
        default: true,
        requiresReload: false,
    });

    game.settings.register(MODULE_ID, "armor-refinements", {
        name: tkey("settings.armor-refinements.name") as string,
        hint: tkey("settings.armor-refinements.hint") as string,
        type: new foundry.data.fields.StringField({
            choices: {
                none: tkey("settings.armor-refinements.none") as string,
                all: tkey("settings.armor-refinements.all") as string,
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
        name: tkey("settings.refresh-refined-items.name") as string,
        hint: tkey("settings.refresh-refined-items.hint") as string,
        type: Boolean,
        config: true,
        default: true,
        requiresReload: false,
    });

    const baneTraitsDefault = new Set([
        "aberration",
        "animal",
        "astral",
        "beast",
        "celestial",
        "construct",
        "dragon",
        "dream",
        "elemental",
        "ethereal",
        "fey",
        "fiend",
        "giant",
        "monitor",
        "ooze",
        "spirit",
        "time",
        "vitality",
        "void",
    ]);
    game.settings.register(MODULE_ID, "homebrew-folder", {
        name: tkey("settings.homebrew-folder.name") as string,
        hint: tkey("settings.homebrew-folder.hint") as string,
        type: String,
        scope: "world",
        config: true,
        requiresReload: true,
    });
    game.settings.register(MODULE_ID, "homebrew-files", {
        name: "homebrew-files",
        type: Array,
        default: [],
        scope: "world",
        config: false,
    });

    game.settings.register(MODULE_ID, "bane-traits", {
        name: tkey("settings.bane-traits.name") as string,
        hint: tkey("settings.bane-traits.hint") as string,
        type: new foundry.data.fields.SetField(
            new foundry.data.fields.StringField({
                required: true,
                label: tkey("settings.bane-traits.name") as string,
                choices: CONFIG.PF2E.creatureTraits,
            }),
            // @ts-expect-error
            { required: true, initial: baneTraitsDefault },
        ),
        config: true,
        requiresReload: true,
    });

    Hooks.on("renderSettingsConfig", (_config, form) => {
        const element = form.querySelector(
            "multi-select#settings-config-pf2e-monster-parts\\.bane-traits",
        );
        if (!element) return;
        const resetBtn = document.createElement("a");
        resetBtn.innerHTML = `<i class="fa-solid fa-arrow-rotate-left"></i>`;
        resetBtn.addEventListener("click", async () => {
            const reset = await foundry.applications.api.DialogV2.confirm({
                // @ts-expect-error
                content: t("settings.bane-traits.confirm-reset"),
            });
            if (reset) {
                await game.settings.set(
                    MODULE_ID,
                    "bane-traits",
                    baneTraitsDefault,
                );
                game.socket.emit("reload");
                // @ts-expect-error
                await foundry.utils.debouncedReload();
            }
        });
        element.appendChild(resetBtn);
    });
}
