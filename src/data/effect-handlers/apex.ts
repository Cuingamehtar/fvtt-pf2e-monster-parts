import { BaseMaterialEffect } from "../material";
import { RefinedItem } from "../../refined-item";
import { PhysicalItemPF2e } from "foundry-pf2e";

export type ApexEffect = BaseMaterialEffect & {
    type: "Apex";
    attribute:
        | NonNullable<PhysicalItemPF2e["system"]["apex"]>["attribute"]
        | null;
};

export class ApexEffectHandler {
    static handleUpdate(
        item: RefinedItem,
        effect: ApexEffect,
        changes: Record<string, unknown>,
    ) {
        const traits = item.item._source.system.traits.value;
        let traitChanges = (foundry.utils.getProperty(
            changes,
            "system.traits.value==",
        ) ?? traits) as string[];
        if (effect.attribute === null) {
            traitChanges = traitChanges.filter((t) => t !== "apex");
        } else {
            if (!traitChanges.includes("apex")) traitChanges.push("apex");
        }
        foundry.utils.mergeObject(
            changes,
            { ["system.traits.value=="]: traitChanges },
            { inplace: true },
        );
        foundry.utils.mergeObject(
            changes,
            { "system.apex.attribute": effect.attribute },
            { inplace: true },
        );
    }
}
