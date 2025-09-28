import { getConfig } from "./config";
import { i18nFormat } from "./utils";
import { HeaderLabel, MaterialData, MaterialEffect } from "./data/material";

let journal: JournalEntry | undefined = undefined;

export function renderSummaryJournal() {
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
    journal.sheet.render(true);
}

function generatePage(m: MaterialData) {
    const name = i18nFormat(m.label) as string;
    const description = i18nFormat(m.description) as string;

    // debug
    const tableHeader = `<tr><th>Entry</th>${Array.fromRange(21)
        .map((i) => `<th style="width:20px">${i}</th>`)
        .join("")}</tr>`;

    const tableRows = m.header?.labels
        ?.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
        ?.map((l) => debugLine(l))
        .join("");
    const headerTable = `<table>${tableHeader}${tableRows}</table>`;

    const effectRows = m.effects.map((l) => debugLineEffect(l)).join("");
    const effectTable = `<table>${tableHeader}${effectRows}</table>`;

    return {
        name,
        text: {
            content:
                description +
                `<details><summary>Debug details</summary>${headerTable}${effectTable}</details>`,
        },
        title: { level: 2 },
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
    const { value, damageCategory, damageType, dieSize, category } =
        effect.rule;
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
    const cells = Array.fromRange(21)
        .map((i) =>
            i >= effect.levelMin &&
            (typeof effect.levelMax == "undefined" || i <= effect.levelMax)
                ? `<td style="vertical-align: middle;"><div style="background-color: black; height:2em;"></div></td>`
                : `<td></td>`,
        )
        .join("");
    const tooltip = JSON.stringify(effect.rule, null, 2);
    return `<tr><td style="vertical-align: middle;"><div style="vertical-align: middle;overflow-y: auto; height:4em" data-tooltip='${tooltip}'>${name}</div></td>${cells}</tr>`;
}
