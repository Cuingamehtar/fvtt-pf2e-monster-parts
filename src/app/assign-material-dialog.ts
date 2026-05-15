import { Utils, t } from "@src/utils";
import { MonsterPart } from "@src/monster-part";
import { Material, MaterialValue } from "@src/material";
import { HTMLRangePickerElement } from "foundry-pf2e/foundry/client/applications/elements/_module";
import { SkipSliderButtons } from "@src/app/elements";
import { RefinedItem } from "@src/refined-item";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class AssignMaterialDialog extends HandlebarsApplicationMixin(
    ApplicationV2,
) {
    static async create(
        options: Omit<
            DeepPartial<foundry.applications.ApplicationConfiguration> &
                AssignMaterialDialogOptions,
            "resolve"
        >,
    ) {
        return await new Promise(
            (resolve: AssignMaterialDialogOptions["resolve"]) => {
                new AssignMaterialDialog({ ...options, resolve }).render(true);
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
                title: "pf2e-monster-parts.dialog.assign-material-dialog.title",
            },
        };

    static override PARTS: Record<
        string,
        foundry.applications.api.HandlebarsTemplatePart
    > = {
        form: {
            template:
                "modules/pf2e-monster-parts/templates/assign-material-dialog.hbs",
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        },
    };

    monsterPart: MonsterPart;
    refinedItem: RefinedItem;
    material: Material;
    maxValue: MaterialValue;
    resolve: AssignMaterialDialogOptions["resolve"];

    skipButtonsLevel?: SkipSliderButtons;
    skipButtonsWhole: SkipSliderButtons;

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> &
            AssignMaterialDialogOptions,
    ) {
        options.uniqueId = `assign-material-dialog-${options.monsterPart.item.id}`;
        const { monsterPart, refinedItem, material } = options;

        const currentLevel = material.getLevel(refinedItem).value;
        const maxLevel = Material.fromKey(
            material.key,
            material.value.add(monsterPart.getValue()).gp,
        ).getLevel(refinedItem).value;

        const skipButtonsLevel =
            maxLevel > currentLevel
                ? new SkipSliderButtons(
                      "level",
                      "Skip to Level",
                      Array.fromRange(
                          maxLevel - currentLevel,
                          currentLevel + 1,
                      ).map((l) =>
                          material
                              .getThresholdForLevel(refinedItem, l)
                              .toSystemCurrency(),
                      ),
                  )
                : undefined;

        const skipButtonsWhole = new SkipSliderButtons(
            "whole",
            "Skip to Whole",
            Array.fromRange(monsterPart.quantity + 1, 0).map(
                (n) => monsterPart.getValue(n).gp,
            ),
        );

        super(
            foundry.utils.mergeObject(
                {
                    actions: {
                        levelSkip: function (
                            this: AssignMaterialDialog,
                            event: PointerEvent,
                        ) {
                            skipButtonsLevel?.onButtonClick(
                                this.element,
                                event,
                            );
                        },
                        wholeSkip: function (
                            this: AssignMaterialDialog,
                            event: PointerEvent,
                        ) {
                            skipButtonsWhole?.onButtonClick(
                                this.element,
                                event,
                            );
                        },
                    },
                },
                options,
                { inplace: false },
            ),
        );

        this.monsterPart = options.monsterPart;
        this.refinedItem = options.refinedItem;
        this.material = options.material;
        this.maxValue = this.monsterPart.getValue();

        this.skipButtonsWhole = skipButtonsWhole;
        this.skipButtonsLevel = skipButtonsLevel;

        this.resolve = options.resolve;
    }

    // @ts-expect-error
    protected override async _prepareContext(): Promise<AssignMaterialContext> {
        const buttons = [
            {
                type: "submit",
                icon: "fa-solid fa-check",
                label: "Confirm",
            },
        ];
        const maxValue = this.maxValue.toSystemCurrency();
        return {
            maxValue: maxValue,
            step: Utils.currencyStep,
            buttons,
            skipButtonsLevel:
                (await this.skipButtonsLevel?.getTemplate(maxValue)) ?? "",
            skipButtonsWhole: await this.skipButtonsWhole.getTemplate(maxValue),
            hintText: AssignMaterialDialog.#prepareHintStrings.bind(this)(
                this.maxValue,
                this.monsterPart.quantity,
                this.monsterPart.getValue(1),
            ),
        };
    }

    protected override _onChangeForm(
        formConfig: fa.ApplicationFormConfiguration,
        event: Event,
    ) {
        super._onChangeForm(formConfig, event);

        this.skipButtonsWhole.onFormChange(this.element);
        this.skipButtonsLevel?.onFormChange(this.element);

        const slider = this.#getSlider();
        const hintDiv = this.element.querySelector('[id="hint-strings"]')!;

        hintDiv.innerHTML = AssignMaterialDialog.#prepareHintStrings.bind(this)(
            MaterialValue.fromSystemCurrency(Number(slider.value)),
            this.monsterPart.quantity,
            this.monsterPart.getValue(1),
        );
    }

    // @ts-expect-error
    protected override _onSubmitForm(
        formConfig: fa.ApplicationFormConfiguration,
        event: Event,
    ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const value = MaterialValue.fromSystemCurrency(
            Number(this.#getSlider().value),
        );
        this.close().then((_) => {
            if (value.gp == 0) {
                this.resolve({
                    value,
                    remainder: new MaterialValue(0),
                    goneFromStack: 0,
                });
            } else {
                const { consumedItems, valueRemaining } =
                    AssignMaterialDialog.#calculateConsumedItems({
                        valueSingle: this.monsterPart.getValue(1),
                        nItems: this.monsterPart.quantity,
                        valueConsumed: value,
                    });
                this.resolve({
                    value,
                    remainder: valueRemaining,
                    goneFromStack: consumedItems,
                });
            }
        });
    }

    #getSlider() {
        return this.element.querySelector(
            '[name="value"]',
        )! as HTMLRangePickerElement;
    }

    static #prepareHintStrings(
        this: AssignMaterialDialog,
        value: MaterialValue,
        nItems: number,
        valueSingle: MaterialValue,
    ) {
        const { consumedItems, valueRemaining } =
            AssignMaterialDialog.#calculateConsumedItems({
                valueSingle,
                nItems,
                valueConsumed: value,
            });
        const text = [];
        if (value.gp > 0) {
            const par = t("dialog.assign-material-dialog.add-value", {
                value: value.toCoins().toString(),
            });
            const addedLevels =
                (this.skipButtonsLevel?.values.findLastIndex(
                    (v) => v < value.toSystemCurrency(),
                ) ?? -1) + 1;
            if (addedLevels > 0) {
                const addendum = t(
                    "dialog.assign-material-dialog.increase-level",
                    { level: String(addedLevels) },
                );
                text.push([par, addendum].join(" "));
            } else {
                text.push(par);
            }
        }
        if (consumedItems > 0) {
            if (consumedItems == nItems) {
                text.push(t("dialog.assign-material-dialog.remove-full-stack"));
            } else {
                text.push(
                    t("dialog.assign-material-dialog.remove-n", {
                        n: String(consumedItems),
                    }),
                );
            }
        }
        if (valueRemaining.gp > 0) {
            text.push(
                t("dialog.assign-material-dialog.value-remaining", {
                    value: valueRemaining.toCoins().toString(),
                }),
            );
        }
        return text
            .filter((s) => typeof s !== "undefined")
            .map((s) => `<p>${s}</p>`)
            .join("");
    }

    static #calculateConsumedItems({
        valueSingle,
        nItems,
        valueConsumed,
    }: {
        valueSingle: MaterialValue;
        nItems: number;
        valueConsumed: MaterialValue;
    }) {
        const totalValue = valueSingle.mul(nItems);
        const consumed = new MaterialValue(
            Math.clamp(valueConsumed.gp, 0, totalValue.gp),
        );
        const consumedItems = Math.ceil(consumed.gp / valueSingle.gp);
        const remainingValue = valueSingle
            .mul(consumedItems)
            .sub(consumed)
            .map((v) => v.toNearest(0.01));
        return {
            consumedItems,
            valueRemaining: remainingValue,
        };
    }
}

interface AssignMaterialDialogOptions {
    monsterPart: MonsterPart;
    refinedItem: RefinedItem;
    material: Material;
    resolve: (args: {
        value: MaterialValue;
        remainder: MaterialValue;
        goneFromStack: number;
    }) => void;
}

interface AssignMaterialContext {
    maxValue: number;
    step: number;
    skipButtonsLevel: string;
    skipButtonsWhole: string;
    hintText: string;
    buttons: {
        type: string;
        icon: string;
        label: string;
    }[];
}
