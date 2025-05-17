import { EnrichmentOptionsPF2e } from "foundry-pf2e";
import { getRefinedItemFlags } from "./flags";

export function registerEnricher(){
    CONFIG.TextEditor.enrichers.push({pattern: /@MPdata/g, enricher})
}

async function enricher(match: RegExpMatchArray, options:EnrichmentOptionsPF2e){
    const item = options.rollData?.item;
    if (!item)
        return null;
    const flags = getRefinedItemFlags(item);
    if (!flags)
        return null;
    

}