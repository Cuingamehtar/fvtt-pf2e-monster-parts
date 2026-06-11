import { getDroppedItem } from "@src/utils";
import { MonsterPart } from "@src/monster-part";
import { ItemPF2e } from "foundry-pf2e";
import { RefinedItem } from "@src/refined-item";
import { AutomaticRefinementProgression } from "@src/modules/automatic-refinement-progression";

export class DynamicStyles {
    // disabled for now
    static registerDragging() {
        let currentlyDragging = false;
        document.addEventListener("dragstart", async (event) => {
            const item = await getDroppedItem(event, "Item");
            if (!item) return;
            if (
                item.isOfType("physical") &&
                MonsterPart.hasMonsterPartData(item)
            ) {
                const part = new MonsterPart(item);
                const materials = part.materials;
                currentlyDragging = true;
                document
                    .querySelectorAll(
                        "fieldset.droppable.refinement, fieldset.droppable.imbue, fieldset.droppable.new-imbue",
                    )
                    .forEach((element) => {
                        if (
                            Array.from(element.querySelectorAll("option")).some(
                                (option) => materials.includes(option.value),
                            )
                        )
                            element.classList.add(
                                "highlighted-material-form-group",
                            );
                    });
            }
        });

        document.addEventListener("dragend", () => {
            if (!currentlyDragging) return;
            document
                .querySelectorAll(".highlighted-material-form-group")
                .forEach((e) =>
                    e.classList.remove("highlighted-material-form-group"),
                );
            currentlyDragging = false;
        });
    }

    static highlightElementOnHover(
        element: Element,
        materials: MaterialKey[],
        target: "monster-part" | "refined-item",
    ) {
        let isHovered = false;
        element.addEventListener("mouseenter", () => {
            document
                .querySelectorAll(".inventory ul.items > li[data-uuid]")
                .forEach((li) => {
                    const uuid = (li as HTMLUListElement).dataset
                        .uuid as string;
                    const item = fromUuidSync(uuid) as ItemPF2e | null;
                    if (!item || !item.isOfType("physical")) return;
                    isHovered = true;
                    if (
                        target == "monster-part" &&
                        MonsterPart.hasMonsterPartData(item)
                    ) {
                        const targetMaterials = new MonsterPart(item).materials;
                        if (
                            materials.some((m) => targetMaterials.includes(m))
                        ) {
                            li
                                .querySelector(".name")
                                ?.classList.add("highlighted-item-glow");
                        }
                    }
                    if (
                        target == "refined-item" &&
                        RefinedItem.hasRefinedItemData(item)
                    ) {
                        const refinedItem = new RefinedItem(item);
                        const targetMaterials = (
                            AutomaticRefinementProgression.isEnabled
                                ? refinedItem.imbuements
                                : [
                                      refinedItem.refinement,
                                      ...refinedItem.imbuements,
                                  ]
                        ).map((m) => m.key);
                        if (
                            materials.some((m) => targetMaterials.includes(m))
                        ) {
                            li
                                .querySelector(".name")
                                ?.classList.add("highlighted-item-glow");
                        }
                    }
                });
        });

        element.addEventListener("mouseleave", () => {
            if (!isHovered) return;
            document
                .querySelectorAll(".highlighted-item-glow")
                .forEach((e) => e.classList.remove("highlighted-item-glow"));
            isHovered = false;
        });
    }
}
