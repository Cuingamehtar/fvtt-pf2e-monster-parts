import { ActorPF2e, ItemPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { getExtendedItemRollOptions } from "./itemUtil";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { getMaterialLevel, getRefinedItemFlags, RefinedItemFlags } from "./flags";
import { RefinementSource } from "./data/data-types";

function optionChoiceDialog(options: (RefinementSource)[]):Promise<RefinementSource> {
    if (options.length==1)
        return Promise.resolve(options[0]);
    return new Promise((resolve) => {
        const select = foundry.applications.fields.createSelectInput({
            options: options.map(o => ({ label: game.i18n.localize(o.label), value: o.key })), name: "selectRefinement"
        });
        new foundry.applications.api.DialogV2({
            window: { title: "Choose an option" },
            content: select.outerHTML,
            buttons: [{
                action: "select",
                label: "Select",
                default: true,
                // @ts-ignore
                callback: (event, button, dialog) => button.form?.elements.selectRefinement.value
            }],
            // @ts-ignore
            submit: result => {
                // @ts-ignore
                resolve(options.find(o=>o.key==result));
            }
        }).render({ force: true })
    });
}


export async function createRefinedItem(actor: ActorPF2e, uuid: ItemUUID) {
    // @ts-ignore
    const config = getConfig();

    const item = await fromUuid(uuid) as PhysicalItemPF2e;
    if (!item) {
        ui.notifications.error(`Invalid item UUID: ${uuid}`);
        return null;
    }
    const ro = getExtendedItemRollOptions(item as ItemPF2e);
    const applicableRefinements = config.materials.filter(m => m.type == "refinement")
        .filter(m => new game.pf2e.Predicate(m.itemPredicate).test(ro));
    if (applicableRefinements.length == 0) {
        ui.notifications.error(`No applicable refinements`);
        return null;
    }
    const refinement = await optionChoiceDialog(applicableRefinements);
    const flags: RefinedItemFlags = { refinement: { key: refinement.key, value: -item.system.price.value.goldValue }, imbues: [] };
    const data = item?.toObject();

    foundry.utils.mergeObject(data, {
        flags: { [MODULE_ID]: { refinedItem: flags } },
        system: { description: { value: "<div class=\"monster-parts-header\">Generated item</div><hr>" + data.system.description.value } }
    }, { inplace: true });

    ChatMessage.create({
        content: `Item ${data.name} with refinement ${game.i18n.localize(refinement.label)} was created`
    })

    return actor.createEmbeddedDocuments("Item", [data]);
}

Hooks.on("renderItemSheetPF2e", (sheet, htmlArray, _) => {
    const html = (htmlArray[0] as HTMLDivElement);
    const div = html.querySelector("div.monster-parts-header");
    if(!div)
        return;
    const item = (sheet.item as ItemPF2e);
    const config = getConfig();
    const flags = item.getFlag(MODULE_ID, "refinedItem") as RefinedItemFlags;
    const refinement = flags.refinement;
    const material = config.materials.find(m => m.key == refinement.key)!;
    let content = `<p>${game.i18n.localize(material.label)} <strong>${getMaterialLevel(refinement, item)} (${Math.floor(refinement.value)} gp)</strong></p>`;
    div.innerHTML = content;
})


export function prepareRefinedItem(item:PhysicalItemPF2e){
    const rules = [];
    const flags = getRefinedItemFlags(item);
    if(!flags)
        return;
    
}