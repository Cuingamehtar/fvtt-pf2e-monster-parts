import { BaseMaterialEffect } from "../material";
import { RefinedItem } from "../../refined-item";

export type AlterationEffect = BaseMaterialEffect & {
    type: "Alteration";
    property: string;
    value: number;
    editData?: boolean;
};

export class AlterationEffectHandler {
    static handleUpdate(
        item: RefinedItem,
        effect: AlterationEffect,
        changes: Record<string, unknown>,
    ) {
        if (effect.editData) return;
        if (
            typeof foundry.utils.getProperty(item.item, effect.property) !==
            "undefined"
        ) {
            foundry.utils.mergeObject(
                changes,
                { [effect.property]: effect.value },
                { inplace: true },
            );
        }
    }
    static handleSyntheticData(item: RefinedItem, effect: AlterationEffect) {
        if (!effect.editData) return;
        if (
            typeof foundry.utils.getProperty(item.item, effect.property) !==
            "undefined"
        ) {
            foundry.utils.setProperty(item.item, effect.property, effect.value);
        }
    }
}
