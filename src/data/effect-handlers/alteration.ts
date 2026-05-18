import { BaseMaterialEffect } from "../material";
import { RefinedItem } from "@src/refined-item";
import { OwnedMaterial } from "@src/material";

export type AlterationEffect = BaseMaterialEffect & {
    type: "Alteration";
    property: string;
    value: number;
    editData?: boolean;
};

export class AlterationEffectHandler {
    static async handleUpdate({
        material,
        effect,
        changes,
    }: {
        material: OwnedMaterial;
        effect: AlterationEffect;
        changes: Record<string, unknown>;
    }) {
        if (effect.editData) return;
        if (
            typeof foundry.utils.getProperty(
                material.parent.item,
                effect.property,
            ) !== "undefined"
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
