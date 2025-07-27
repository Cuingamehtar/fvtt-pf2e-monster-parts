import { ItemSheetPF2e, NPCSheetPF2e } from "foundry-pf2e";
import { createConfig } from "./config";
import {
    getExtendedItemRollOptions,
    getExtendedNPCRollOptions,
} from "./itemUtil";
import { createMonsterPart } from "./monster-part";
import { registerSettings } from "./settings";
import { registerEnricher } from "./enricher";
import { configureMonsterPart } from "./app/monster-part-editor";
import { configureRefinedItem } from "./app/refined-item-editor";
import type { ItemPF2e } from "foundry-pf2e";
import { createElement, t } from "./utils";
import { createRefinedItemDialog } from "./app/refined-item-create";

export const MODULE_ID = "pf2e-monster-parts";

Hooks.once("init", () => {
    registerSettings();
    Hooks.once("i18nInit", () => createConfig());

    // @ts-expect-error
    game[MODULE_ID] = {
        createMaterial: createMonsterPart,
        getExtendedItemRollOptions,
        getExtendedNPCRollOptions,
        configureMonsterPart,
        configureRefinedItem,
    };
    registerEnricher();
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
        btn.addEventListener("click", () => createMonsterPart(actor));

        elem?.insertBefore(btn, elem.firstChild);
    },
);

Hooks.on(
    "getItemSheetPF2eHeaderButtons",
    (sheet: ItemSheetPF2e<ItemPF2e>, buttons) => {
        const item = sheet.object;
        if (item.getFlag(MODULE_ID, "monster-part")) {
            buttons.unshift({
                icon: "fas fa-skull",
                label: "Modify",
                class: "configure-monster-part",
                onclick: () => configureMonsterPart(item),
            });
        }
        if (item.getFlag(MODULE_ID, "refined-item")) {
            buttons.unshift({
                icon: "fas fa-skull",
                label: "Modify",
                class: "configure-refined-item",
                onclick: () => configureRefinedItem(item),
            });
        }
    },
);

Hooks.on(
    "renderDialogV2",
    (dialog: foundry.applications.api.DialogV2, html: HTMLElement) => {
        if (!dialog.options.classes.includes("dialog-item-create")) return;
        const selector = html.querySelector("select")!;
        const refinedItemOption = createElement("option", {
            attributes: { value: "refined-item" },
            innerHTML: t("RefinedItem"),
        });
        /*const monsterPartOption = createElement("option", {
            attributes: { value: "monster-part" },
            innerHTML: t("MonsterPart"),
        });*/
        const optgroup = createElement("optgroup", {
            attributes: {
                label: t("MonsterParts") as string,
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
            if (["refined-item", "monster-part"].includes(value)) {
                dialog.close();
                event.stopImmediatePropagation();
                console.log(value);
                if (value == "refined-item") createRefinedItemDialog();
                // TODO: open refined item window
            } else {
                callback(event, button);
            }
        };
    },
);
