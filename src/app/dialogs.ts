import { i18nFormat, t } from "../utils";
import { configureMonsterPart } from "./monster-part-editor";
import { configureRefinedItem } from "./refined-item-editor";

const { DialogV2 } = foundry.applications.api;

interface SelectDialogOption {
    key: string;
    label: I18nKey | I18nString;
}

export function dialogSelectMaterial(
    options: SelectDialogOption[],
    maxValue: number,
    title?: I18nString,
    content?: I18nString
): Promise<string | undefined> {
    return new Promise((resolve) => {
        const select = foundry.applications.fields.createSelectInput({
            options: options.map((o) => ({
                label: i18nFormat(o.label) as string,
                value: o.key
            })),
            name: "selectedOption"
        });
        const valueField = foundry.applications.fields.createNumberInput({
            min: 0,
            max: maxValue,
            step: Math.round(maxValue) === maxValue ? 1 : 0.1
        });
        new DialogV2({
            window: { title: (title ?? t("Dialog.DefaultTitle")) as string },
            content: content
                ? `<p>${content}</p>${select.outerHTML}${valueField.outerHTML}`
                : select.outerHTML,
            buttons: [
                {
                    action: "select",
                    label: "Select",
                    default: true,
                    callback: (_event, button, _dialog) =>
                        // @ts-expect-error "elements don't have property in their type"
                        button.form?.elements.selectedOption.value
                }
            ],
            submit: async (result) => {
                resolve(result);
            }
        }).render({ force: true });
    });
}

export function dialogConfirmCancel(
    title: I18nString,
    content: I18nString
): Promise<boolean> {
    return DialogV2.prompt({
        window: {
            title: title as string
        },
        content: content as string,
        modal: true
    });
}

export function dialogSlider(
    title: I18nString, value: number,
    min: number, max: number
): Promise<number | null> {
    const content = `<input type="range", id="numberValue" name="numberValue" value="${value}" min="${min} max="${max} />"<div class="display">${value}</div>`;
    return new Promise((resolve, _reject) => {
        new DialogV2({
            window: {
                title: title as string
            },
            content,
            modal: true,
            submit: async (result) => {
                resolve(result);
            }
        }).render(true);
    });
}

export const dialogs = {
    selectMaterial: dialogSelectMaterial,
    confirm: dialogConfirmCancel,
    slider: dialogSlider,
    monsterPart: configureMonsterPart,
    refinedItem: configureRefinedItem
}