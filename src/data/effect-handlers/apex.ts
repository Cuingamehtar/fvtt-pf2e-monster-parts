import { BaseMaterialEffect } from "../material";
import { PhysicalItemPF2e } from "@7h3laughingman/pf2e-types";
import { AttachedMaterial } from "@src/material";

export type ApexEffect = BaseMaterialEffect & {
    type: "Apex";
    attribute:
        | NonNullable<PhysicalItemPF2e["system"]["apex"]>["attribute"]
        | null;
};

export class ApexEffectHandler {
    static async handleUpdate({
        material,
        effect,
        changes,
    }: {
        effect: ApexEffect;
        changes: Record<string, unknown>;
        material: AttachedMaterial;
    }) {
        const traits = material.parent.item._source.system.traits.value;
        let traitChanges = (foundry.utils.getProperty(
            changes,
            "system.traits.value",
        ) ?? traits) as string[];
        if (effect.attribute === null) {
            traitChanges = traitChanges.filter((t) => t !== "apex");
        } else {
            if (!traitChanges.includes("apex")) traitChanges.push("apex");
        }
        foundry.utils.mergeObject(
            changes,
            { ["system.traits"]: { value: _replace(traitChanges) } },
            { inplace: true },
        );
        foundry.utils.mergeObject(
            changes,
            { "system.apex.attribute": effect.attribute },
            { inplace: true },
        );
    }
}
