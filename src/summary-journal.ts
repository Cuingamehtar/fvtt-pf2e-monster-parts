import { getConfig } from "./config";
import { i18nFormat } from "./utils";
import { HeaderLabel, MaterialData, MaterialEffect } from "@data/material";
import { MODULE_ID } from "./module";
import {
    DamageDiceSource,
    FlatModifierSource,
} from "@7h3laughingman/pf2e-types";
import { ItemCastSource } from "@data/data-types";

let journal: JournalEntry | undefined = undefined;

export function renderSummaryJournal(materialKey?: string) {
    if (!journal) {
        const config = getConfig();
        const materials = [...config.materials.values()];
        /* const _refinementPages = materials
            .filter((e) => e.type === "refinement")
            .map((m) => generatePage(m))
            .sort((a, b) => a.name.localeCompare(b.name)); */

        const imbuementPages = materials
            .filter((e) => e.type === "imbuement")
            .map((m) => generatePage(m))
            .sort((a, b) => a.name.localeCompare(b.name));

        journal = new CONFIG.JournalEntry.documentClass({
            name: "Materials",
            pages: imbuementPages,
            ownership: { default: 2 },
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
        const keyLevels = [
            ...description
                .matchAll(/<li>(?:<p>)?<strong>(\d+)?/g)
                .map(([, l]) => Number(l))
                .filter(Boolean),
        ];

        // debug
        const tableHeader = `<tr><th>Entry</th>${Array.fromRange(21)
            .map(
                (i) =>
                    `<th style="width:20px;writing-mode: vertical-lr;padding: 0;${thresholdLine(i, keyLevels)}">${i}</th>`,
            )
            .join("")}</tr>`;

        const tableRows = m.header?.labels
            ?.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
            ?.map((l) => debugLine(l, keyLevels))
            .join("");
        const headerTable = `<table style="table-layout: fixed;">${tableHeader}${tableRows}</table>`;

        const effectRows =
            m.effects?.map((l) => debugLineEffect(l, keyLevels)).join("") ?? [];
        const effectTable = `<table style="table-layout: fixed;">${tableHeader}${effectRows}</table>`;

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

function debugLine(label: HeaderLabel, keyLevels: number[]) {
    const name = i18nFormat(label.text);
    const cells = Array.fromRange(21)
        .map((i) =>
            i >= label.levelMin &&
            (typeof label.levelMax == "undefined" || i <= label.levelMax)
                ? `<td style="vertical-align: middle;padding: 0;width:20px;${thresholdLine(i, keyLevels)}"><div style="background-color: var(--color-text-primary); height:2em"></div></td>`
                : `<td style="${thresholdLine(i, keyLevels)}"></td>`,
        )
        .join("");
    return `<tr><td style="vertical-align: middle;"><div style="vertical-align: middle;overflow-y: scroll; height:4em">${name}</div></td>${cells}</tr>`;
}

function debugLineEffect(effect: MaterialEffect, keyLevels: number[]) {
    const { contents, tooltip } = getEffectRowLabel(effect);

    const cells = Array.fromRange(21)
        .map((i) =>
            i >= effect.levelMin &&
            (typeof effect.levelMax == "undefined" || i <= effect.levelMax)
                ? `<td style="vertical-align: middle;padding: 0;width:20px;${thresholdLine(i, keyLevels)}"><div style="background-color: var(--color-text-primary); height:2em;"></div></td>`
                : `<td style="${thresholdLine(i, keyLevels)}"></td>`,
        )
        .join("");
    return `<tr><td style="vertical-align: middle;"><div style="vertical-align: middle;overflow-y: auto; height:4em" ${tooltip ? `data-tooltip='${tooltip}'` : ""}>${contents}</div></td>${cells}</tr>`;
}

function thresholdLine(level: number, thresholds: number[]) {
    return thresholds.includes(level) ? "border-left:2px solid" : "";
}

function getEffectRowLabel(effect: MaterialEffect): {
    contents: string;
    tooltip?: string;
} {
    if (effect.type === "Alteration") {
        return { contents: `Alteration (${effect.property}: ${effect.value})` };
    }
    if (effect.type === "Apex") {
        return {
            contents: `Apex ${effect.attribute ? `(${effect.attribute})` : "(unset)"}`,
        };
    }
    if (effect.type === "RuleElement") {
        const rule = effect.rule;
        const tooltip = JSON.stringify(rule, null, 2);
        if (rule.key == "DamageDice") {
            return (({ dieSize, category, damageType }) => ({
                contents: `Damage Dice (${dieSize}${typeof category == "undefined" ? "" : ` ${category}`}${typeof damageType == "undefined" ? "" : ` ${damageType}`})`,
                tooltip,
            }))(rule as DamageDiceSource);
        }
        if (rule.key == "FlatModifier")
            return (({ value, damageCategory, damageType }) => ({
                contents: `Flat Modifier (${value}${typeof damageCategory == "undefined" ? "" : ` ${damageCategory}`}${typeof damageType == "undefined" ? "" : ` ${damageType}`})`,
                tooltip,
            }))(rule as FlatModifierSource);
        if (rule.key == "ItemCast")
            return (({ uuid, rank }) => ({
                contents: `${foundry.utils.fromUuidSync(uuid)?.name}${rank ? ` (Rank ${rank})` : ""}`,
                tooltip,
            }))(rule as ItemCastSource);
        return { contents: rule.key, tooltip };
    }
    return { contents: "" };
}
