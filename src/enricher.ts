import { EnrichmentOptionsPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { RefinedItemFlags } from "./flags";

export function registerEnricher(){
    CONFIG.TextEditor.enrichers.push({pattern: /@MPdata/g, enricher})
}

async function enricher(match: RegExpMatchArray, options:EnrichmentOptionsPF2e){
    const item = options.rollData?.item;
    if (!item)
        return null;
    const flags = item.getFlag(MODULE_ID, "refinedItem") as (RefinedItemFlags|undefined);
    if (!flags)
        return null;
    

}