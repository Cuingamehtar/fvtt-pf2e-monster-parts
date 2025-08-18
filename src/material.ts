import { ItemPF2e, NPCPF2e, Predicate } from "foundry-pf2e";
import {
    ImbueSource,
    InlineNoteEffectSource,
    RefinementSource,
} from "./data/data-types";
import { getExtendedNPCRollOptions } from "./actor-utils";
import { getConfig } from "./config";
import { RefinedItem } from "./refined-item";
import { i18nFormat } from "./utils";

export class Material<T extends RefinementSource | ImbueSource> {
    data: T;
    value: number;
    #itemPredicate?: Predicate;
    #creaturePredicate?: Predicate;

    constructor(data: T, value = 0) {
        this.data = data;
        this.value = value;
    }

    static fromKey(key: MaterialKey, value = 0) {
        const config = getConfig();
        const m = config.materials.get(key);
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
        if (item) return this.#itemPredicate.test(item.getRollOptions());
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
            const level = thr.findLastIndex((e) => e < this.value);
            return level === -1 ? 0 : level;
        }
        return 0;
    }

    getEffects(item: RefinedItem) {
        const level = this.getLevel(item);
        return this.data.effects
            .filter(
                (e) =>
                    e.levels.from <= level &&
                    (!e.levels.to || level <= e.levels.to),
            )
            .flatMap((e) => e.effects);
    }

    getFlavor(item: RefinedItem) {
        const level = this.getLevel(item);
        return {
            label: i18nFormat(this.data.label),
            flavor: i18nFormat(this.data.flavor),
            effects: this.data.effects
                .filter(
                    (e) =>
                        e.levels.from <= level &&
                        (!e.levels.to || level <= e.levels.to),
                )
                .flatMap((e) =>
                    e.effects
                        .filter(
                            (ei): ei is InlineNoteEffectSource =>
                                ei.key == "InlineNote" &&
                                (!ei.predicate ||
                                    new game.pf2e.Predicate(ei.predicate).test(
                                        item.item.getRollOptions(),
                                    )),
                        )
                        .map((ei) => i18nFormat(ei.text, ei.parameters)),
                ),
        };
    }
}
