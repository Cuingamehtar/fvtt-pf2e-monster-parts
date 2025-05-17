import { EquipmentSheetPF2e, NPCSheetPF2e } from "foundry-pf2e";
import { createConfig } from "./config";
import { createRefinedItem } from "./item";
import { getExtendedItemRollOptions, getExtendedNPCRollOptions } from "./itemUtil";
import { createMonsterPart } from "./monster-part";
import { registerSettings } from "./settings";
import { registerEnricher } from "./enricher";
import { configureMonsterPart } from "./app/monster-part-editor";

export const MODULE_ID = "pf2e-monster-parts";

Hooks.once("init", () => {
    registerSettings();
    Hooks.once("i18nInit", () => createConfig());

    // @ts-ignore
    game[MODULE_ID] = { createMaterial: createMonsterPart, createRefinedItem, getExtendedItemRollOptions, getExtendedNPCRollOptions, configureMonsterPart }
    registerEnricher();

});

Hooks.on("renderNPCSheetPF2e", (sheet: NPCSheetPF2e, html: HTMLDivElement[], { editable }: { editable: boolean }) => {
    if (!editable)
        return;
    const actor = sheet.actor;
    const elem = html[0]?.querySelector("[data-item-types=\"equipment\"]")?.previousElementSibling?.querySelector("div.item-controls");

    const btn = document.createElement("a");
    btn.innerHTML = "<i class=\"fa-solid fa-fw fa-skull\"></i>";
    btn.classList.add("create-monster-parts");
    btn.setAttribute("data-tooltip", "Create Monster Parts");
    btn.addEventListener("click", () => createMonsterPart(actor));

    elem?.insertBefore(btn, elem.firstChild);
});

Hooks.on("getEquipmentSheetPF2eHeaderButtons", (sheet: EquipmentSheetPF2e, buttons:ApplicationHeaderButton[]) => {
    const item = sheet.object;
    const flags = item.getFlag(MODULE_ID, "monsterPart");
    if (flags){
        buttons.unshift(({icon:"fas fa-skull", label:"Modify", class:"configure-monster-part", onclick: () => configureMonsterPart(item)}));
    }
})