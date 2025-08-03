import { getDroppedItem, t } from "../utils";
import { RefinedItem } from "../refined-item";

export function createRefinedItemDialog() {
    const content = `<div style="text-align: center;">${t("dialog.createrefineditem.content")}</div>`;

    return foundry.applications.api.DialogV2.wait({
        content: content,
        window: { title: t("dialog.createrefineditem.title") as string },
        buttons: [
            {
                action: "ok",
                icon: "fa-solid fa-times",
                label: "Close",
            },
        ],
        render: (renderEvent, dialog) => {
            const input = dialog.window.content as HTMLElement;
            input.addEventListener("drop", async (event) => {
                const item = await getDroppedItem(event, "Item");
                if (!item) return;
                if (!item.parent) {
                    ui.notifications.error(
                        t("dialog.createrefineditem.erroritemnotowned"),
                    );
                    return;
                }
                if (await RefinedItem.fromItem(item)) dialog.close();
            });
        },
    });
}
