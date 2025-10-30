import { RefinedItem } from "../../refined-item";
import { BaseMaterialEffect } from "../material";
import { RuleElementEffectSource } from "../data-types";

export type RuleElementEffect = BaseMaterialEffect & {
    type: "RuleElement";
    rule: RuleElementEffectSource["rule"];
};

export class RuleElementEffectHandler {
    static handleUpdate(
        _item: RefinedItem,
        effect: RuleElementEffect,
        changes: Record<string, unknown>,
    ) {
        const property = foundry.utils.getProperty(changes, "system.==rules");
        if (Array.isArray(property)) {
            property.push(effect.rule);
        } else {
            foundry.utils.mergeObject(
                changes,
                { ["system.==rules"]: [effect.rule] },
                { inplace: true },
            );
        }
    }
}
