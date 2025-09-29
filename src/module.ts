import { ItemSheetPF2e, NPCSheetPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { createConfig } from "./config";
import { registerSettings } from "./settings";
import { configureMonsterPart } from "./app/monster-part-editor";
import { configureRefinedItem } from "./app/refined-item-editor";
import { createElement, t } from "./utils";
import { createRefinedItemDialog } from "./app/refined-item-create";
import { MonsterPart } from "./monster-part";
import { extendDerivedData, RefinedItem } from "./refined-item";
import { registerInlineNotes } from "./description";
import { renderSummaryJournal } from "./summary-journal";
import { Material } from "./material";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { registerEndCombatDialog } from "./app/after-combat-dialog";

export const MODULE_ID = "pf2e-monster-parts";

Hooks.once("init", () => {
    registerSettings();
    Hooks.once("ready", async () => {
        await createConfig();
        if (
            game.settings.get(MODULE_ID, "refresh-refined-items") &&
            game.user.isActiveGM
        ) {
            for (const actor of game.actors) {
                for (const item of actor.items) {
                    if (
                        item.getFlag(MODULE_ID, "refined-item") &&
                        item.isOfType("physical")
                    ) {
                        const refinedItem = new RefinedItem(item);
                        refinedItem.updateItem();
                    }
                }
            }
        }
        extendDerivedData();
        registerEndCombatDialog();
    });
    registerInlineNotes();
    game.modules.get(MODULE_ID).api = {
        renderSummaryJournal,
        Material,
        RefinedItem,
        getExtendedNPCRollOptions,
    };
});

Hooks.on(
    "renderNPCSheetPF2e",
    (
        sheet: NPCSheetPF2e,
        html: HTMLDivElement[],
        { editable }: { editable: boolean },
    ) => {
        if (!editable) return;
        const actor = sheet.actor;
        const elem = html[0]
            ?.querySelector('[data-item-types="equipment"]')
            ?.previousElementSibling?.querySelector("div.item-controls");

        const btn = document.createElement("a");
        btn.innerHTML = '<i class="fa-solid fa-fw fa-skull"></i>';
        btn.classList.add("create-monster-parts");
        btn.setAttribute("data-tooltip", "Create Monster Parts");
        btn.addEventListener("click", () => MonsterPart.fromCreature(actor));

        elem?.insertBefore(btn, elem.firstChild);
    },
);

Hooks.on(
    "getItemSheetPF2eHeaderButtons",
    (sheet: ItemSheetPF2e<PhysicalItemPF2e>, buttons) => {
        const item = sheet.object;
        if (item.getFlag(MODULE_ID, "monster-part")) {
            buttons.unshift({
                icon: "fas fa-skull",
                label: t("dialog.monster-part-editor.button"),
                class: "configure-monster-part",
                onclick: () =>
                    configureMonsterPart(
                        new MonsterPart(item as PhysicalItemPF2e),
                    ),
            });
        }
        if (item.getFlag(MODULE_ID, "refined-item")) {
            buttons.unshift({
                icon: "fas fa-skull",
                label: t("dialog.refined-item-editor.button"),
                class: "configure-refined-item",
                onclick: () =>
                    configureRefinedItem(
                        new RefinedItem(item as PhysicalItemPF2e),
                    ),
            });
        }
    },
);

Hooks.on(
    "renderDialogV2",
    (dialog: foundry.applications.api.DialogV2, html: HTMLElement) => {
        if (
            !(
                dialog.options.classes.includes("item-create") ||
                dialog.options.classes.includes("dialog-item-create")
            )
        )
            return;
        const selector = html.querySelector("select")!;
        const refinedItemOption = createElement("option", {
            attributes: { value: "refined-item" },
            innerHTML: t("refined-item.label"),
        });
        const optgroup = createElement("optgroup", {
            attributes: {
                label: t("monster-parts") as string,
            },
            children: [refinedItemOption],
        });
        selector.appendChild(optgroup);
        // @ts-expect-error
        const callback = dialog.options.buttons.ok.callback;
        // @ts-expect-error
        dialog.options.buttons.ok.callback = (
            event: SubmitEvent,
            button: HTMLButtonElement,
        ) => {
            const value = selector.value;
            if (value == "refined-item") {
                dialog.close();
                event.stopImmediatePropagation();
                createRefinedItemDialog();
            } else {
                callback(event, button);
            }
        };
    },
);
