import { t } from "../utils";
import { configureMonsterPart } from "./monster-part-editor";
import { configureRefinedItem } from "./refined-item-editor";

interface SelectDialogOption<T> {
    key: T;
    label: I18nString;
}

function optionChoiceDialog<T>(
    options: SelectDialogOption<T>[],
    title?: I18nString,
): Promise<{ selected: string } | null> {
    const select = foundry.applications.fields.createSelectInput({
        options: options.map((o) => ({
            label: o.label as string,
            value: o.key as string,
        })),
        name: "selected",
    });
    const content = select.outerHTML;
    return foundry.applications.api.DialogV2.input({
        window: { title: (title ?? t("dialog.default-title")) as string },
        content: content,
        ok: {
            label: "Select",
            icon: "fa-solid fa-check",
        },
    });
}

export const dialogs = {
    choice: optionChoiceDialog,
    monsterPart: configureMonsterPart,
    refinedItem: configureRefinedItem,
};
