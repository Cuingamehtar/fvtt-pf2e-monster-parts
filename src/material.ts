import { ItemPF2e, NPCPF2e, Predicate } from "foundry-pf2e";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { getConfig } from "./config";
import { RefinedItem } from "./refined-item";
import { i18nFormat, isSF2e } from "./utils";
import { MaterialData } from "@data/material";
import { MODULE_ID } from "./module";

const materialAliases: Record<string, MaterialKey> = {
    "imbue:mental:magic": "imbue:mind:magic",
    "imbue:mental:might": "imbue:mind:might",
    "imbue:mental:tech": "imbue:mind:tech",
};

export class Material {
    data: MaterialData;
    value: MaterialValue;
    #itemPredicate?: Predicate;
    #creaturePredicate?: Predicate;

    constructor(data: MaterialData, value: number = 0) {
        this.data = data;
        this.value = new MaterialValue(value ?? 0);
    }

    static fromKey(key: MaterialKey, value: number = 0) {
        const config = getConfig();
        const m = config.materials.get(materialAliases[key as string] ?? key);
        if (!m) return undefined;
        return new Material(m, value);
    }

    get key() {
        return this.data.key;
    }
    get type() {
        return this.data.type;
    }
    get label() {
        return this.data.label;
    }

    testItem({
        rollOptions,
        item,
    }: {
        rollOptions?: string[];
        item?: ItemPF2e;
    }) {
        if (typeof this.#itemPredicate === "undefined")
            this.#itemPredicate = new game.pf2e.Predicate(
                this.data.itemPredicate,
            );
        if (rollOptions) return this.#itemPredicate.test(rollOptions);
        if (item) return this.#itemPredicate.test(item.getRollOptions("item"));
        ui.notifications.warn(
            "No item or roll option array was provided for material predicate",
        );
        return false;
    }

    testCreature({
        rollOptions,
        actor,
    }: {
        rollOptions?: string[];
        actor?: NPCPF2e;
    }) {
        if (typeof this.#creaturePredicate === "undefined")
            this.#creaturePredicate = new game.pf2e.Predicate(
                this.data.monsterPredicate ?? [],
            );
        if (rollOptions) return this.#creaturePredicate.test(rollOptions);
        if (actor)
            return this.#creaturePredicate.test(
                getExtendedNPCRollOptions(actor),
            );
        ui.notifications.warn(
            "No actor or roll option array was provided for material predicate",
        );
        return false;
    }

    getLevel(item: RefinedItem): { value: number; capped: boolean } {
        const isLevelCapped = game.settings.get(
            MODULE_ID,
            "level-capped",
        ) as boolean;
        const config = getConfig();
        const thresholds = config.thresholds[this.data.type];
        // get level thresholds from config and default to equipment for unknown item type;
        const itemType = (
            Object.keys(thresholds).includes(item.item.type)
                ? item.item.type
                : "equipment"
        ) as keyof typeof thresholds;
        const thr = thresholds[itemType];
        let level = thr.findLastIndex((e) => this.value.gp >= e);
        level = level === -1 ? 0 : level + 1;
        if (!isLevelCapped) return { value: level, capped: false };
        if (this.type === "refinement") {
            return item.item.parent?.level !== undefined
                ? {
                      value: Math.min(level, item.item.parent.level),
                      capped: item.item.parent.level < level,
                  }
                : { value: level, capped: false };
        } else {
            const refinementLevel = item.refinement?.getLevel(item).value ?? 0;
            return {
                value: Math.min(level, refinementLevel),
                capped: refinementLevel < level,
            };
        }
    }

    get coinValue() {
        return this.value.toCoins();
    }

    getThresholdForLevel(item: RefinedItem, level: number): MaterialValue {
        const config = getConfig();
        const thresholds = config.thresholds[this.data.type];
        // get level thresholds from config and default to equipment for unknown item type;
        const itemType = (
            Object.keys(thresholds).includes(item.item.type)
                ? item.item.type
                : "equipment"
        ) as keyof typeof thresholds;
        const thr = thresholds[itemType];
        const clampedLevel = Math.clamp(level, 0, thr.length);
        return new MaterialValue(clampedLevel == 0 ? 0 : thr[clampedLevel - 1]);
    }

    getEffects(item: RefinedItem) {
        const level = this.getLevel(item).value;
        return (
            this.data.effects?.filter(
                (e) =>
                    e.levelMin <= level && (!e.levelMax || level <= e.levelMax),
            ) ?? []
        );
    }

    getFlavor(item: RefinedItem) {
        const level = this.getLevel(item).value;
        const rollData = item.item.getRollData();
        const rollOptions = item.getRollOptions();
        return {
            label: i18nFormat(this.data.label, rollData),
            flavor: i18nFormat(this.data.header.description, rollData),
            parts: this.data.header.labels
                ?.filter(
                    (e) =>
                        e.levelMin <= level &&
                        (!e.levelMax || level <= e.levelMax) &&
                        (e.predicate
                            ? new game.pf2e.Predicate(e.predicate).test(
                                  rollOptions,
                              )
                            : true),
                )
                .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
                .map((e) => i18nFormat(e.text, rollData)),
        };
    }

    static getFlagDataName(materialKey: string, value: string) {
        function convertSlug(s: string) {
            const parts = s.split("-");
            return parts
                .slice(1)
                .reduce(
                    (acc, e) => acc + e[0].toUpperCase() + e.slice(1),
                    parts[0],
                );
        }
        return convertSlug(
            `${game.pf2e.system.sluggify(materialKey)}-${game.pf2e.system.sluggify(value)}`,
        );
    }

    static getRollDataPath(materialKey: string, value: string) {
        return (
            "@item.flags.pf2e-monster-parts.values." +
            Material.getFlagDataName(materialKey, value)
        );
    }
}

export class MaterialValue {
    gp: number;
    constructor(gp?: number) {
        gp = Number(gp);
        if (DEBUG && isNaN(gp)) {
            gp = 0;
            ui.notifications.warn("Material value is invalid. Reset to 0");
        }
        this.gp = gp ?? 0;
    }

    static fromSystemCurrency(value: number) {
        const norm = isSF2e() ? value / 10 : value;
        return new MaterialValue(norm);
    }

    toCoins() {
        if (this.gp <= 0) return new game.pf2e.Coins();
        const sp = (this.gp % 1) * 10;
        const cp = (sp % 1) * 10;
        return new game.pf2e.Coins({
            gp: Math.floor(Number(this.gp.toFixed(1))),
            sp: Math.floor(Number(sp.toFixed(1))),
            cp: Math.floor(Number(cp.toFixed(1))),
        });
    }

    toSystemCurrency() {
        return this.gp * (isSF2e() ? 10 : 1);
    }

    add(rhs: MaterialValue) {
        if (DEBUG && !(rhs instanceof MaterialValue)) {
            ui.notifications.error("Rhs is not MaterialValue");
        }
        return new MaterialValue(this.gp + rhs.gp);
    }

    sub(rhs: MaterialValue) {
        if (DEBUG && !(rhs instanceof MaterialValue)) {
            ui.notifications.error("Rhs is not MaterialValue");
        }
        return new MaterialValue(this.gp - rhs.gp);
    }

    mul(scale: number) {
        return new MaterialValue(this.gp * scale);
    }

    map(f: (gp: number) => number) {
        return new MaterialValue(f(this.gp));
    }

    round(precision: number = 0.01) {
        return new MaterialValue(this.gp.toNearest(precision));
    }
}
