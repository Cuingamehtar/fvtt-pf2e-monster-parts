import { getDroppedItem, t } from "../utils";
import { RefinedItem } from "../refined-item";

export function createRefinedItemDialog() {
    const content = `<div style="text-align: center;">${t("dialog.create-refined-item.content")}</div>`;

    return foundry.applications.api.DialogV2.wait({
        content: content,
        // @ts-expect-error
        window: { title: t("dialog.create-refined-item.title") as string },
        buttons: [
            {
                action: "ok",
                icon: "fa-solid fa-times",
                label: "Close",
            },
        ],
        render: (renderEvent, dialog) => {
            // @ts-expect-error
            const input = dialog.window.content as HTMLElement;
            input.addEventListener("drop", async (event) => {
                const item = await getDroppedItem(event, "Item");
                if (!item) return;

                if (await RefinedItem.fromOwnedItem(item)) dialog.close();
            });
        },
    });
}
