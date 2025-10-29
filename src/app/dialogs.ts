import { simplifyCoins, t } from "../utils";
import { configureMonsterPart } from "./monster-part-editor";
import { configureRefinedItem } from "./refined-item-editor";

const { DialogV2 } = foundry.applications.api;

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
    let content = select.outerHTML;
    return foundry.applications.api.DialogV2.input({
        window: { title: (title ?? t("dialog.default-title")) as string },
        content: content,
        ok: {
            label: "Select",
            icon: "fa-solid fa-check",
        },
    });
}

function confirmApplyMaterial(
    addedValue: number,
    material: string,
    consumedQuantity: number,
    consumedRemainder: number,
): Promise<boolean | undefined> {
    let content = t("dialog.confirm-apply-material.content", {
        value: simplifyCoins(addedValue).toString(),
        material: material,
    });
    if (consumedQuantity !== 0)
        content +=
            " " +
            t("dialog.confirm-apply-material.consume", {
                quantity: consumedQuantity,
            });
    if (consumedRemainder > 0)
        content +=
            " " +
            t("dialog.confirm-apply-material.remainder", {
                remainder: simplifyCoins(consumedRemainder).toString(),
            });
    return DialogV2.prompt({
        window: {
            title: t("dialog.confirm-apply-material.title") as string,
        },
        content: `<p>${content}</p>`,
        modal: true,
    }) as Promise<boolean | undefined>;
}

function dialogSlider(
    title: I18nString,
    min: number,
    max: number,
): Promise<{ value: number } | null> {
    const step = max < 5 ? 1 : 0.01;
    const field = new foundry.data.fields.NumberField({
        min,
        max,
        initial: max,
        step,
    });
    const content = (field.toInput({ name: "value" }) as HTMLElement).outerHTML;
    return foundry.applications.api.DialogV2.input({
        window: { title: title as string },
        content: content,
        ok: {
            label: "Ok",
            icon: "fa-solid fa-check",
        },
    });
}

export const dialogs = {
    choice: optionChoiceDialog,
    confirmApplyMaterial,
    slider: dialogSlider,
    monsterPart: configureMonsterPart,
    refinedItem: configureRefinedItem,
};
