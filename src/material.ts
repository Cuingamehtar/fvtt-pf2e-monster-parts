import { ItemPF2e, NPCPF2e, Predicate } from "foundry-pf2e";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { getConfig } from "./config";
import { RefinedItem } from "./refined-item";
import { i18nFormat, Utils } from "./utils";
import { MaterialData } from "@data/material";
import { AutomaticRefinementProgression } from "@src/modules/automatic-refinement-progression";
import { LevelCap } from "@src/modules/level-cap";

const materialAliases: Record<string, MaterialKey> = {
    "imbue:mental:magic": "imbue:mind:magic",
    "imbue:mental:might": "imbue:mind:might",
    "imbue:mental:tech": "imbue:mind:tech",
};

interface MaterialContext {
    parent: RefinedItem;
}

abstract class MaterialBase {
    data: MaterialData;
    value: MaterialValue;
    #itemPredicate?: Predicate;
    #creaturePredicate?: Predicate;

    protected constructor(data: MaterialData, value: number = 0) {
        this.data = data;
        this.value = new MaterialValue(value ?? 0);
    }

    get key(): MaterialKey {
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
}

export class Material extends MaterialBase {
    constructor(data: MaterialData, value: number = 0) {
        super(data, value);
    }

    static fromKey(key: MaterialKey, value?: number): Material;
    static fromKey(
        key: MaterialKey,
        value: number,
        context: MaterialContext,
    ): AttachedMaterial;
    static fromKey(key: string, value?: number): Material | undefined;
    static fromKey(
        key: string,
        value: number,
        context: MaterialContext,
    ): AttachedMaterial | undefined;
    static fromKey(
        key: string | MaterialKey,
        value: number = 0,
        context?: MaterialContext,
    ) {
        const config = getConfig();
        const m = config.materials.get(materialAliases[key as string] ?? key);
        if (!m) return undefined;
        if (context?.parent) return new AttachedMaterial(m, value, context);
        return new Material(m, value);
    }

    getLevel(item: RefinedItem) {
        return Material.getLevel(this, item);
    }

    static getLevel(material: MaterialBase, item: RefinedItem): number {
        const config = getConfig();
        const thresholds = config.thresholds[material.data.type];
        // get level thresholds from config and default to equipment for unknown item type;
        const itemType = (
            Object.keys(thresholds).includes(item.item.type)
                ? item.item.type
                : "equipment"
        ) as keyof typeof thresholds;
        const thr = thresholds[itemType];
        let level = thr.findLastIndex((e) => material.value.gp >= e);
        level = level === -1 ? 0 : level + 1;
        return level;
    }

    getThresholdForLevel(item: RefinedItem, level: number) {
        return Material.getThresholdForLevel(this, item, level);
    }

    static getThresholdForLevel(
        material: MaterialBase,
        item: RefinedItem,
        level: number,
    ): MaterialValue {
        const config = getConfig();
        const thresholds = config.thresholds[material.data.type];
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

    static getEffects(material: MaterialBase, item: RefinedItem) {
        const level = Material.getLevel(material, item);
        if (typeof level === "undefined") return [];
        return (
            material.data.effects?.filter(
                (e) =>
                    e.levelMin <= level && (!e.levelMax || level <= e.levelMax),
            ) ?? []
        );
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

export class AttachedMaterial extends MaterialBase {
    readonly parent: RefinedItem;

    constructor(
        data: MaterialData,
        value: number = 0,
        { parent }: MaterialContext,
    ) {
        super(data, value);
        this.parent = parent;
    }

    get owningActor() {
        return this.parent.item.parent;
    }

    get effectiveValue() {
        if (
            this.type === "refinement" &&
            AutomaticRefinementProgression.isEnabled &&
            this.owningActor?.isOfType("character")
        ) {
            return {
                value: AutomaticRefinementProgression.effectiveRefinementValue(
                    this.parent,
                    this.owningActor,
                ),
                capped: false,
            };
        }
        const value = this.value;
        const maxLevel = LevelCap.maximumLevel(this);

        if (maxLevel === null) return { value, capped: false };
        const maxValue = this.getThresholdForLevel(maxLevel);
        if (maxValue.gp > value.gp) return { value, capped: false };
        return { value: maxValue, capped: true };
    }

    getLevel() {
        return Material.getLevel(this, this.parent);
    }

    get effectiveLevel() {
        const baseLevel = this.getLevel();
        if (!LevelCap.isEnabled) {
            return { value: baseLevel, capped: false };
        }
        const maxLevel = LevelCap.maximumLevel(this);
        if (maxLevel === null || maxLevel >= baseLevel)
            return { value: baseLevel, capped: false };
        return { value: maxLevel, capped: true };
    }

    getEffects() {
        return Material.getEffects(this, this.parent);
    }
    getFlavor() {
        const level = this.effectiveLevel.value;
        const rollData = this.getRollData();
        const rollOptions = this.parent.getRollOptions();
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
    getRollData() {
        const opt = {
            value: this.effectiveValue.value,
            level: this.effectiveLevel.value,
        };
        return { ...this.parent.item.getRollData(), material: opt };
    }

    getThresholdForLevel(level: number) {
        return Material.getThresholdForLevel(this, this.parent, level);
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

    static fromSystemCurrency(value: number | string) {
        value = Number(value);
        if (isNaN(value)) throw new Error("Material value is not a number");
        const norm = Utils.isSF ? value / 10 : value;
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
        return this.gp * (Utils.isSF ? 10 : 1);
    }

    add(rhs: MaterialValue) {
        return new MaterialValue(this.gp + rhs.gp);
    }

    sub(rhs: MaterialValue) {
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
