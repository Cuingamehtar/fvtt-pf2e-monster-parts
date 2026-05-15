import type HTMLRangePickerElement from "foundry-pf2e/foundry/client/applications/elements/_module";

export class SkipSliderButtons {
    key: string;
    values: number[];
    label: string;
    sliderName: string;
    constructor(
        key: string,
        label: I18nString,
        values: number[],
        sliderName: string = "value",
    ) {
        this.key = key;
        this.values = values;
        this.label = label as string;
        this.sliderName = sliderName;
    }

    async getTemplate(value: number) {
        return await foundry.applications.handlebars.renderTemplate(
            "modules/pf2e-monster-parts/templates/skip-slider.hbs",
            {
                key: this.key,
                label: this.label,
                disableLower: value <= this.values[0],
                disableHigher: value >= this.values[this.values.length - 1],
            },
        );
    }

    onFormChange(element: HTMLElement) {
        const value = Number(
            (
                element.querySelector(
                    `range-picker[name="${this.sliderName}"]`,
                )! as HTMLRangePickerElement
            ).value,
        );

        element.querySelector<HTMLButtonElement>(
            `button[data-action="${this.key}Skip"][data-direction="lower"]`,
        )!.disabled = value <= this.values[0];

        element.querySelector<HTMLButtonElement>(
            `button[data-action="${this.key}Skip"][data-direction="higher"]`,
        )!.disabled = value >= this.values[this.values.length - 1];
    }

    onButtonClick(element: HTMLElement, event: PointerEvent) {
        const slider = element.querySelector(
            `range-picker[name="${this.sliderName}"]`,
        )! as HTMLRangePickerElement;

        const button = (event.target as HTMLElement)!.closest("button");
        if (button?.dataset.action !== `${this.key}Skip`) return;

        const value = Number(slider.value);
        if (button.dataset.direction == "lower") {
            const e = this.values.findLast((v) => v < value);
            if (typeof e !== "undefined") slider.value = String(e);
        } else if (button.dataset.direction == "higher") {
            const e = this.values.find((v) => v > value);
            if (typeof e !== "undefined") slider.value = String(e);
        }
    }
}
