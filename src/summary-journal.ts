import { getConfig } from "./config";
import { i18nFormat } from "./utils";
import { HeaderLabel, MaterialData, MaterialEffect } from "./data/material";
import { MODULE_ID } from "./module";

let journal: JournalEntry | undefined = undefined;

export function renderSummaryJournal(materialKey?: string) {
    if (!journal) {
        const config = getConfig();
        const entries = [...config.materials.values()];
        journal = new CONFIG.JournalEntry.documentClass({
            name: "Imbuements",
            pages: entries
                .filter((e) => e.type === "imbuement")
                .map((m) => generatePage(m))
                .sort((a, b) => a.name.localeCompare(b.name)),
        });
    }
    if (!materialKey) return journal.sheet.render(true);
    const page = journal.pages.find(
        (p) => p.flags["pf2e-monster-parts"]?.["material-key"] == materialKey,
    );
    if (page) {
        return journal.sheet.render(true, { pageId: page.id });
    } else {
        ui.notifications.warn(
            `Could not find page for material ${materialKey}`,
        );
        return journal.sheet.render(true);
    }
}

function generatePage(m: MaterialData) {
    const name = i18nFormat(m.label) as string;
    let description = i18nFormat(m.description) as string;

    if (game.settings.get(MODULE_ID, "show-debug-info")) {
        // debug
        const tableHeader = `<tr><th>Entry</th>${Array.fromRange(21)
            .map((i) => `<th style="width:20px">${i}</th>`)
            .join("")}</tr>`;

        const tableRows = m.header?.labels
            ?.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
            ?.map((l) => debugLine(l))
            .join("");
        const headerTable = `<table>${tableHeader}${tableRows}</table>`;

        const effectRows =
            m.effects?.map((l) => debugLineEffect(l)).join("") ?? [];
        const effectTable = `<table>${tableHeader}${effectRows}</table>`;

        description += `<details><summary>Debug details</summary>${headerTable}${effectTable}</details>`;
    }
    return {
        name,
        text: {
            content: description,
        },
        title: { level: 2 },
        flags: { ["pf2e-monster-parts"]: { ["material-key"]: m.key } },
    };
}

function debugLine(label: HeaderLabel) {
    const name = i18nFormat(label.text);
    const cells = Array.fromRange(21)
        .map((i) =>
            i >= label.levelMin &&
            (typeof label.levelMax == "undefined" || i <= label.levelMax)
                ? `<td style="vertical-align: middle;"><div style="background-color: black; height:2em"></div></td>`
                : `<td></td>`,
        )
        .join("");
    return `<tr><td style="vertical-align: middle;"><div style="vertical-align: middle;overflow-y: scroll; height:4em">${name}</div></td>${cells}</tr>`;
}

function debugLineEffect(effect: MaterialEffect) {
    let name = "";
    let tooltip = "";
    if (effect.type == "Alteration") {
        name = `Alteration (${effect.property}: ${effect.value})`;
    } else if (effect.type === "RuleElement") {
        const { value, damageCategory, damageType, dieSize, category } =
            effect.rule;
        tooltip = JSON.stringify(effect.rule, null, 2);
        switch (effect.rule.key) {
            case "DamageDice":
                name = `Damage Dice (${dieSize}${typeof category == "undefined" ? "" : ` ${category}`}${typeof damageType == "undefined" ? "" : ` ${damageType}`})`;
                break;
            case "FlatModifier":
                name = `Flat Modifier (${value}${typeof damageCategory == "undefined" ? "" : ` ${damageCategory}`}${typeof damageType == "undefined" ? "" : ` ${damageType}`})`;
                break;
            default:
                name = effect.rule.key;
        }
    }
    const cells = Array.fromRange(21)
        .map((i) =>
            i >= effect.levelMin &&
            (typeof effect.levelMax == "undefined" || i <= effect.levelMax)
                ? `<td style="vertical-align: middle;"><div style="background-color: black; height:2em;"></div></td>`
                : `<td></td>`,
        )
        .join("");
    return `<tr><td style="vertical-align: middle;"><div style="vertical-align: middle;overflow-y: auto; height:4em" ${tooltip ? `data-tooltip='${tooltip}'` : ""}>${name}</div></td>${cells}</tr>`;
}
