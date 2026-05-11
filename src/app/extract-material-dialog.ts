import { t } from "@src/utils";
import { Material, MaterialValue } from "@src/material";
import { RefinedItem } from "@src/refined-item";
import { MODULE_ID } from "@src/module";

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
            actions: {
                previousLevel: ExtractMaterialDialog.#onClickPreviousLevel,
            },
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
    transferScale: number;

    resolve: ExtractMaterialDialogOptions["resolve"];

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> &
            ExtractMaterialDialogOptions,
    ) {
        options.uniqueId = `extract-material-dialog-${options.refinedItem.item.id}`;
        super(options);
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

    // @ts-expect-error
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
            step: this.maxValue.toSystemCurrency() < 5 ? 0.01 : 1,
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

    // @ts-expect-error
    protected override _onSubmitForm(
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

        this.close().then((_) => {
            this.resolve({ subtracted, extracted });
        });
    }

    #getSlider() {
        return this.element.querySelector(
            `[name="subtracted-value"]`,
        ) as HTMLInputElement;
    }

    static #onClickPreviousLevel(
        this: ExtractMaterialDialog,
        _event: PointerEvent,
    ) {
        const subtractedSlider = this.#getSlider();
        const subtracted = MaterialValue.fromSystemCurrency(
            subtractedSlider.value,
        );
        const current = Material.fromKey(
            this.material.key,
            this.material.value.sub(subtracted).gp,
        );
        const currentLevel = current.getLevel(this.refinedItem).value;
        const currentLevelThreshold = current.getThresholdForLevel(
            this.refinedItem,
            currentLevel,
        );
        if (currentLevelThreshold.gp < current.value.gp) {
            subtractedSlider.value = String(
                this.maxValue.sub(currentLevelThreshold).toSystemCurrency(),
            );
        } else {
            const levelThreshold = this.material.getThresholdForLevel(
                this.refinedItem,
                currentLevel - 1,
            );
            subtractedSlider.value = String(
                this.maxValue.sub(levelThreshold).toSystemCurrency(),
            );
        }
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

interface ExtractMaterialContext {
    maxValue: number;
    step: number;
    hintText: string;
    buttons: {
        type: string;
        icon: string;
        label: string;
    }[];
}
