import { t } from "@src/utils";
import { MonsterPart } from "@src/monster-part";
import { MaterialValue } from "@src/material";

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
            actions: {
                nextLevel: AssignMaterialDialog.#onClickNextLevel,
                nextWhole: AssignMaterialDialog.#onClickNextWhole,
            },
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
    nextLevelValue?: MaterialValue;
    maxValue: MaterialValue;
    resolve: AssignMaterialDialogOptions["resolve"];

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> &
            AssignMaterialDialogOptions,
    ) {
        options.uniqueId = `assign-material-dialog-${options.monsterPart.item.id}`;
        super(options);
        this.monsterPart = options.monsterPart;
        this.nextLevelValue = options.nextLevelValue;
        this.maxValue = this.monsterPart.getValue();
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
        return {
            canReachNextLevel:
                typeof this.nextLevelValue !== "undefined" &&
                this.maxValue.gp >= this.nextLevelValue.gp,
            maxValue: this.maxValue.toSystemCurrency(),
            step: this.maxValue.toSystemCurrency() < 5 ? 0.01 : 1,
            buttons,
            hintText: AssignMaterialDialog.#prepareHintStrings(
                this.maxValue,
                this.monsterPart.quantity,
                this.monsterPart.getValue(1),
                this.nextLevelValue,
            ),
        };
    }

    protected override _onChangeForm(
        formConfig: fa.ApplicationFormConfiguration,
        event: Event,
    ) {
        super._onChangeForm(formConfig, event);

        const slider = this.#getSlider();
        const hintDiv = this.element.querySelector('[id="hint-strings"]')!;

        hintDiv.innerHTML = AssignMaterialDialog.#prepareHintStrings(
            MaterialValue.fromSystemCurrency(Number(slider.value)),
            this.monsterPart.quantity,
            this.monsterPart.getValue(1),
            this.nextLevelValue,
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
        )! as HTMLInputElement;
    }

    static #onClickNextLevel(this: AssignMaterialDialog, _event: PointerEvent) {
        if (typeof this.nextLevelValue === "undefined") return;
        const slider = this.#getSlider();
        slider.value = this.nextLevelValue.toSystemCurrency().toString();
    }
    static #onClickNextWhole(this: AssignMaterialDialog, _event: PointerEvent) {
        const slider = this.#getSlider();
        const current = MaterialValue.fromSystemCurrency(Number(slider.value));
        const singleValue = this.monsterPart.getValue(1);
        slider.value = current
            .map((cur) =>
                Math.clamp(
                    Math.ceil(cur / singleValue.gp) * singleValue.gp,
                    0,
                    this.maxValue.gp,
                ),
            )
            .toSystemCurrency()
            .toString();
    }

    static #prepareHintStrings(
        value: MaterialValue,
        nItems: number,
        valueSingle: MaterialValue,
        nextLevel?: MaterialValue,
    ) {
        const { consumedItems, valueRemaining } =
            AssignMaterialDialog.#calculateConsumedItems({
                valueSingle,
                nItems,
                valueConsumed: value,
            });
        return [
            value.gp > 0
                ? (t("dialog.assign-material-dialog.add-value", {
                      value: value.toCoins().toString(),
                  }) as string) +
                  (nextLevel && value > nextLevel
                      ? (t(
                            "dialog.assign-material-dialog.increase-level",
                        ) as string)
                      : "") +
                  "."
                : "",
            consumedItems == nItems
                ? t("dialog.assign-material-dialog.remove-full-stack")
                : t("dialog.assign-material-dialog.remove-n", {
                      n: String(consumedItems),
                  }),
            valueRemaining.gp > 0
                ? t("dialog.assign-material-dialog.value-remaining", {
                      value: valueRemaining.toCoins().toString(),
                  })
                : undefined,
        ]
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
    nextLevelValue?: MaterialValue;
    resolve: (args: {
        value: MaterialValue;
        remainder: MaterialValue;
        goneFromStack: number;
    }) => void;
}

interface AssignMaterialContext {
    canReachNextLevel: boolean;
    maxValue: number;
    step: number;
    hintText: string;
    buttons: {
        type: string;
        icon: string;
        label: string;
    }[];
}
