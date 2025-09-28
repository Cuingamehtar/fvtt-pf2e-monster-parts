import { ItemPF2e, NPCPF2e, Predicate } from "foundry-pf2e";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { getConfig } from "./config";
import { RefinedItem } from "./refined-item";
import { i18nFormat } from "./utils";
import { MaterialData } from "./data/material";

const materialAliases: Record<string, MaterialKey> = {};

export class Material {
    data: MaterialData;
    value: number;
    #itemPredicate?: Predicate;
    #creaturePredicate?: Predicate;

    constructor(data: MaterialData, value = 0) {
        this.data = data;
        this.value = value;
    }

    static fromKey(key: MaterialKey, value = 0) {
        const config = getConfig();
        const m = config.materials.get(materialAliases[key as string] ?? key);
        if (!m) return undefined;
        return new Material(m, value);
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

    getLevel(item: RefinedItem): number {
        const config = getConfig();
        const thresholds = config.thresholds[this.data.type];
        const itemType = item.item.type;
        if (Object.keys(thresholds).includes(itemType)) {
            const type = itemType as
                | "weapon"
                | "armor"
                | "shield"
                | "equipment";
            const thr = thresholds[type];
            const level = thr.findLastIndex((e) => this.value >= e);
            return level === -1 ? 0 : level + 1;
        }
        return 0;
    }

    getEffects(item: RefinedItem) {
        const level = this.getLevel(item);
        return this.data.effects.filter(
            (e) => e.levelMin <= level && (!e.levelMax || level <= e.levelMax),
        );
    }

    getFlavor(item: RefinedItem) {
        const level = this.getLevel(item);
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
