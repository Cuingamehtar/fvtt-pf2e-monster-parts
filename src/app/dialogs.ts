import { t } from "../utils";
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

function dialogConfirmCancel(
    title: I18nString,
    content: I18nString,
): Promise<boolean | undefined> {
    return DialogV2.prompt({
        window: {
            title: title as string,
        },
        content: content as string,
        modal: true,
    }) as Promise<boolean | undefined>;
}

function dialogSlider(
    title: I18nString,
    value: number,
    min: number,
    max: number,
): Promise<{ value: number } | null> {
    const content = `<input type="range" id="value" name="value" value="${value}" min="${min}" max="${max}" />
<p>${t("dialog.slider.value")}: <output id="display">${value}</output></p>`;
    return foundry.applications.api.DialogV2.input({
        window: { title: title as string },
        content: content,
        ok: {
            label: "Ok",
            icon: "fa-solid fa-check",
        },
        render: (renderEvent, dialog) => {
            const input = dialog.window.content.querySelector("input#value");
            const v = dialog.window.content.querySelector("output#display");
            input.addEventListener("input", (event) => {
                v.innerHTML = event.target.value;
            });
        },
    });
}

export const dialogs = {
    choice: optionChoiceDialog,
    confirm: dialogConfirmCancel,
    slider: dialogSlider,
    monsterPart: configureMonsterPart,
    refinedItem: configureRefinedItem,
};
