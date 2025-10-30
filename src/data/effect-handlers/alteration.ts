import { BaseMaterialEffect } from "../material";
import { RefinedItem } from "../../refined-item";

export type AlterationEffect = BaseMaterialEffect & {
    type: "Alteration";
    property: string;
    value: number;
};

export class AlterationEffectHandler {
    static handleSyntheticData(item: RefinedItem, effect: AlterationEffect) {
        if (
            typeof foundry.utils.getProperty(item.item, effect.property) !==
            "undefined"
        ) {
            foundry.utils.setProperty(item.item, effect.property, effect.value);
        }
    }
}
