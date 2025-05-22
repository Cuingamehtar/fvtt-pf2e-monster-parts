import { ItemPF2e, NPCPF2e, Predicate } from "foundry-pf2e";
import { ImbueSource, RefinementSource } from "./data/data-types";
import {
    getExtendedItemRollOptions,
    getExtendedNPCRollOptions,
} from "./itemUtil";

export class Material<T extends RefinementSource | ImbueSource> {
    data: T;
    #itemPredicate: Predicate;
    #creaturePredicate: Predicate;

    constructor(data: T) {
        this.data = data;
        this.#itemPredicate = new game.pf2e.Predicate(data.itemPredicate);
        this.#creaturePredicate = new game.pf2e.Predicate(
            data.monsterPredicate ?? [],
        );
    }

    testItem({
        rollOptions,
        item,
    }: {
        rollOptions?: string[];
        item?: ItemPF2e;
    }) {
        if (rollOptions) return this.#itemPredicate.test(rollOptions);
        if (item)
            return this.#itemPredicate.test(getExtendedItemRollOptions(item));
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
