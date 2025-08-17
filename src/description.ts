import { PhysicalItemPF2e } from "foundry-pf2e";
import { RefinedItem } from "./refined-item";
import { MODULE_ID } from "./module";
import { MonsterPart } from "./monster-part";

async function addDescriptionNote(
    item: PhysicalItemPF2e,
    description: { value: string; gm: string },
) {
    if (item.getFlag(MODULE_ID, "monster-part")) {
        description.value =
            (await new MonsterPart(item).descriptionHeader()) +
            description.value;
    }
    if (item.getFlag(MODULE_ID, "refined-item")) {
        description.value =
            (await new RefinedItem(item).descriptionHeader()) +
            description.value;
    }
    return description;
}

export function registerInlineNotes(): void {
    const types = ["weapon", "armor", "equipment", "shield"];
    for (const t of types) {
        libWrapper.register(
            MODULE_ID,
            `CONFIG.PF2E.Item.documentClasses.${t}.prototype.getDescription`,
            async function (
                this: PhysicalItemPF2e,
                wrapped: (options: any) => Promise<{
                    value: string;
                    gm: string;
                }>,
                args: any,
            ) {
                return addDescriptionNote(this, await wrapped(args));
            },
        );
    }
}
