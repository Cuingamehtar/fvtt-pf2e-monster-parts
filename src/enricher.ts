import { EnrichmentOptionsPF2e } from "foundry-pf2e";
import { getEffects } from "./item";
import { i18nFormat } from "./utils";

export function registerEnricher(): void {
    CONFIG.TextEditor.enrichers.push({ pattern: /@MPdata/g, enricher });
}

async function enricher(match: RegExpMatchArray, options: EnrichmentOptionsPF2e): Promise<HTMLDivElement | null> {
    const item = options.rollData?.item;
    if (!item)
        return null;
    if (!item.getFlag("pf2e-monster-parts", "refinedItem"))
        return null;
    const effects = getEffects(item);
    const text = effects
        .map(m => {
            if (m === null)
                return "";
            const notes = m.effects
                .filter(e => e.key === "InlineNote")
                .map(e => `<li>${i18nFormat(e.text, e.parameters)}</li>`);
            if (notes.length === 0)
                return `<p><strong>${m.label}, Level ${m.level} (${m.value} gp)</strong></p>`;
            return `<p><strong>${m.label}, Level ${m.level} (${m.value} gp)</strong><ul>${notes.join("")}</ul></p>`;
        }).join("");
    const el = document.createElement("div");
    el.innerHTML = await TextEditor.enrichHTML(text);
    return el;
}