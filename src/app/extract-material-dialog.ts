import { t, Utils } from "@src/utils";
import { Material, MaterialValue } from "@src/material";
import { RefinedItem } from "@src/refined-item";
import { MODULE_ID } from "@src/module";
import { SkipSliderButtons } from "@src/app/elements";
import { HTMLRangePickerElement } from "foundry-pf2e/foundry/client/applications/elements/_module";
import { ApplicationRenderContext } from "foundry-pf2e/foundry/client/applications/_types";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class ExtractMaterialDialog extends HandlebarsApplicationMixin(
    ApplicationV2,
) {
    static async create(
        options: Omit<
            DeepPartial<foundry.applications.ApplicationConfiguration> &
                ExtractMaterialDialogOptions,
            "resolve"
        >,
    ) {
        return await new Promise(
            (resolve: ExtractMaterialDialogOptions["resolve"]) => {
                new ExtractMaterialDialog({ ...options, resolve }).render(true);
            },
        );
    }

    static override DEFAULT_OPTIONS: DeepPartial<foundry.applications.ApplicationConfiguration> =
        {
            tag: "form",
            form: {
                submitOnChange: false,
                closeOnSubmit: true,
            },
            window: {
                contentClasses: ["standard-form"],
                title: "pf2e-monster-parts.dialog.extract-material-dialog.title",
            },
        };

    static override PARTS: Record<
        string,
        foundry.applications.api.HandlebarsTemplatePart
    > = {
        form: {
            template:
                "modules/pf2e-monster-parts/templates/extract-material-dialog.hbs",
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        },
    };

    refinedItem: RefinedItem;
    material: Material;
    maxValue: MaterialValue;
    skipButtonsLevel: SkipSliderButtons;
    transferScale: number;

    resolve: ExtractMaterialDialogOptions["resolve"];

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> &
            ExtractMaterialDialogOptions,
    ) {
        options.uniqueId = `extract-material-dialog-${options.refinedItem.item.id}`;
        const { material, refinedItem } = options;

        const currentLevel = material.getLevel(refinedItem).value;

        const skipButtonsLevel = new SkipSliderButtons(
            "level",
            "Skip to Level",
            Array.fromRange(currentLevel + 1)
                .map((l) =>
                    material.value
                        .sub(material.getThresholdForLevel(refinedItem, l))
                        .toSystemCurrency(),
                )
                .reverse(),
        );

        super(
            foundry.utils.mergeObject(
                {
                    actions: {
                        levelSkip: function (
                            this: ExtractMaterialDialog,
                            event: PointerEvent,
                        ) {
                            skipButtonsLevel.onButtonClick(this.element, event);
                        },
                    },
                },
                options,
                { inplace: false },
            ),
        );
        this.skipButtonsLevel = skipButtonsLevel;
        this.refinedItem = options.refinedItem;
        this.material = options.material;
        this.maxValue = this.material.value;
        switch (game.settings.get(MODULE_ID, "transfer-tax")) {
            case "half":
                this.transferScale = 0.5;
                break;
            case "none":
                this.transferScale = 1.0;
                break;
            case "default":
            default:
                this.transferScale = 0.9;
        }
        this.resolve = options.resolve;
    }

    protected override async _prepareContext(): Promise<ExtractMaterialContext> {
        const buttons = [
            {
                type: "submit",
                icon: "fa-solid fa-check",
                label: "Confirm",
            },
        ];
        return {
            maxValue: this.maxValue.toSystemCurrency(),
            step: Utils.isSF ? 0.01 : 0.1,
            skipButtonsLevel: await this.skipButtonsLevel.getTemplate(0),
            buttons,
            hintText: "",
        };
    }

    protected override _onChangeForm(
        formConfig: fa.ApplicationFormConfiguration,
        event: Event,
    ) {
        super._onChangeForm(formConfig, event);

        const subtracted = MaterialValue.fromSystemCurrency(
            this.#getSlider().value,
        );

        const button = this.element.querySelector(
            'button[data-action="previousLevel"]',
        ) as HTMLButtonElement;
        button.disabled = subtracted.gp >= this.maxValue.gp;

        const hintDiv = this.element.querySelector('[id="hint-strings"]')!;

        hintDiv.innerHTML = this.#prepareHintStrings();
    }

    protected override async _onSubmitForm(
        formConfig: fa.ApplicationFormConfiguration,
        event: Event,
    ) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const sliderSubtracted = this.#getSlider();

        const subtracted = MaterialValue.fromSystemCurrency(
            sliderSubtracted.value,
        );
        const extracted = subtracted.mul(this.transferScale).round();

        this.close().then(() => {
            this.resolve({ subtracted, extracted });
        });
    }

    #getSlider() {
        return this.element.querySelector<HTMLRangePickerElement>(
            `[name="value"]`,
        );
    }

    #prepareHintStrings(this: ExtractMaterialDialog) {
        const subtracted = MaterialValue.fromSystemCurrency(
            this.#getSlider().value,
        );
        const extracted = subtracted.mul(this.transferScale).round();
        const currentLevel = this.material.getLevel(this.refinedItem).value;
        const newLevel = Material.fromKey(
            this.material.key,
            this.material.value.sub(subtracted).gp,
        ).getLevel(this.refinedItem).value;

        return [
            extracted.gp > 0
                ? (t("dialog.extract-material-dialog.extract-note", {
                      value: extracted.toCoins().toString(),
                  }) as string)
                : undefined,
            subtracted.gp > 0
                ? (t("dialog.extract-material-dialog.subtract-note", {
                      value: subtracted.toCoins().toString(),
                  }) as string)
                : undefined,
            newLevel < currentLevel
                ? t("dialog.extract-material-dialog.level-decrease-note", {
                      difference: String(currentLevel - newLevel),
                  })
                : undefined,
        ]
            .filter((s) => typeof s !== "undefined")
            .map((s) => `<p>${s}</p>`)
            .join("");
    }
}

interface ExtractMaterialDialogOptions {
    refinedItem: RefinedItem;
    material: Material;
    resolve: (args: {
        subtracted: MaterialValue;
        extracted: MaterialValue;
    }) => void;
}

interface ExtractMaterialContext extends ApplicationRenderContext {
    maxValue: number;
    step: number;
    skipButtonsLevel: string;
    hintText: string;
    buttons: {
        type: string;
        icon: string;
        label: string;
    }[];
}
