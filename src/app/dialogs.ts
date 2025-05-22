import { i18nFormat, t } from "../utils";

interface SelectDialogOption {
    key: string;
    label: string;
}
export function dialogSelectFromOptions(
    options: SelectDialogOption[],
    title?: string,
    content?: string,
): Promise<string | undefined> {
    return new Promise((resolve) => {
        const select = foundry.applications.fields.createSelectInput({
            options: options.map((o) => ({
                label: i18nFormat(o.label),
                value: o.key,
            })),
            name: "selectedOption",
        });
        new foundry.applications.api.DialogV2({
            window: { title: title ?? t("Dialog.DefaultTitle") },
            content: content
                ? `<p>${content}</p>${select.outerHTML}`
                : select.outerHTML,
            buttons: [
                {
                    action: "select",
                    label: "Select",
                    default: true,
                    callback: (_event, button, _dialog) =>
                        // @ts-expect-error "elements don't have property in their type"
                        button.form?.elements.selectedOption.value,
                },
            ],
            submit: async (result) => {
                resolve(result);
            },
        }).render({ force: true });
    });
}

export function dialogConfirmCancel(
    title: string,
    content: string,
): Promise<boolean> {
    return foundry.applications.api.DialogV2.confirm({
        window: {
            title,
        },
        content,
        modal: true,
    });
}
