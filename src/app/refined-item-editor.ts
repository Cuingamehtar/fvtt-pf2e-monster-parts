import { getConfig, getMaterialLabel } from "../config";
import { CurrencyConverter, getDroppedItem, i18nFormat, t } from "../utils";
import { RefinedItem } from "../refined-item";
import { Material } from "../material";
import { dialogs } from "./dialogs";
import { MonsterPart } from "../monster-part";
import { AutomaticRefinementProgression } from "../automatic-refinement-progression";
import {
    ModuleFlags,
    NormalizedValue,
    RefinedItemFlags,
} from "../../types/global";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface RefinedItemEditorData {
    possibleRefinements: { key: MaterialKey; label: I18nString | I18nKey }[];
    possibleImbues: { key: MaterialKey; label: I18nString | I18nKey }[];
    refinement: {
        selected: MaterialKey;
        value: NormalizedValue;
        isDisabled: boolean;
    };
    imbues: { selected: MaterialKey; value: NormalizedValue }[];
    item: RefinedItem;
}

class RefinedItemEditor extends HandlebarsApplicationMixin(ApplicationV2) {
    data: RefinedItemEditorData;

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> & {
            data: RefinedItemEditorData;
        },
    ) {
        super(options);
        this.data = options.data;
    }

    updateItem() {
        const flag = this.data.item.getFlag();
        return this.data.item.updateItem(
            foundry.utils.mergeObject(flag, this.flagFromData(), {
                inplace: false,
            }),
        );
    }

    flagFromData(): RefinedItemFlags {
        return {
            refinement: {
                key: this.data.refinement.selected,
                value: this.data.refinement.value,
            },
            imbues: this.data.imbues.map((i) => ({
                key: i.selected,
                value: i.value,
            })),
        };
    }

    static PARTS = {
        form: {
            template:
                "modules/pf2e-monster-parts/templates/refined-item-editor.hbs",
        },
    };

    static DEFAULT_OPTIONS = {
        tag: "form",
        form: {
            submitOnChange: true,
            closeOnSubmit: false,
        },
        window: {
            contentClasses: ["standard-form"],
            title: "",
            width: 300,
            height: 600,
            closeOnSubmit: true,
        },
    };

    async _prepareContext() {
        return {
            data: {
                possibleRefinements: this.data.possibleRefinements,
                possibleImbues: this.data.possibleImbues,
                refinement: {
                    selected: this.data.refinement.selected,
                    value: CurrencyConverter.ToSystemCurrency(
                        this.data.refinement.value,
                    ),
                },
                imbues: this.data.imbues.map((i) => ({
                    selected: i.selected,
                    value: CurrencyConverter.ToSystemCurrency(i.value),
                })),
            },
        };
    }

    override async _onRender(
        _context: object,
        _options: foundry.applications.ApplicationRenderOptions,
    ) {
        this.element
            .querySelector("select.refinement-type")
            ?.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                if ((e.target as any).value) {
                    this.data.refinement.selected = (e.target as any).value;
                    this.updateItem();
                }
            });
        this.element
            .querySelector("input#refinement-value")
            ?.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.data.refinement.value = CurrencyConverter.ToValue(
                    Number((e.target as any).value),
                );
                this.updateItem();
            });

        this.element
            .querySelectorAll("select.imbue-type")
            .forEach((element, i) => {
                element.addEventListener("change", (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if ((e.target as any).value) {
                        this.data.imbues[i].selected = (e.target as any).value;
                    } else {
                        this.data.imbues.splice(i, 1);
                        this.render();
                    }
                    this.updateItem();
                });
            });

        this.element
            .querySelectorAll("input.imbue-value")
            .forEach((element, i) => {
                element.addEventListener("change", (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.data.imbues[i].value = CurrencyConverter.ToValue(
                        Number((e.target as any).value),
                    );
                    this.updateItem();
                });
            });

        const newImbue = this.element.querySelector(
            "select#new-imbue-type",
        ) as HTMLSelectElement;
        newImbue.addEventListener("change", (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            if ((e.target as any).value) {
                this.data.imbues.push({
                    selected: (e.target as any).value,
                    value: 0,
                });
            }
            this.updateItem();
            this.render();
        });

        this.element
            .querySelectorAll("fieldset.droppable")
            .forEach((element) => {
                element.addEventListener("drop", async (e) => {
                    const select = element.querySelector("select");
                    if (!select) return;

                    const item = await getDroppedItem(e as DragEvent, "Item");
                    if (!item) return;
                    if (!item.isOfType("physical")) {
                        ui.notifications.error(
                            t("monster-part.error-not-physical-item"),
                        );
                        return;
                    }

                    if (!MonsterPart.hasMonsterPartData(item)) {
                        ui.notifications.error(
                            t("monster-part.error-not-monster-part"),
                        );
                        return;
                    }

                    const monsterPart = new MonsterPart(item);

                    const expectedMaterial = select.value;
                    const selectedMaterial =
                        expectedMaterial === ""
                            ? await (async () => {
                                  const allowedMaterials =
                                      this.data.possibleImbues.filter(
                                          (i) =>
                                              monsterPart.materials.includes(
                                                  i.key,
                                              ) &&
                                              !this.data.imbues.some(
                                                  (e) => e.selected == i.key,
                                              ),
                                      );
                                  if (allowedMaterials.length == 0) {
                                      ui.notifications.error(
                                          t(
                                              "dialog.choose-material.error-no-applicable-material",
                                          ),
                                      );
                                      return null;
                                  }
                                  return (
                                      await dialogs.choice(
                                          allowedMaterials,
                                          t("dialog.choose-material.title"),
                                      )
                                  )?.selected;
                              })()
                            : monsterPart.materials.includes(expectedMaterial)
                              ? expectedMaterial
                              : (() => {
                                    ui.notifications.error(
                                        t(
                                            "dialog.choose-material.error-no-applicable-material",
                                        ),
                                    );
                                    return null;
                                })();
                    if (!selectedMaterial) return;
                    const addedValue = CurrencyConverter.ToValue(
                        (
                            await dialogs.slider(
                                t("dialog.choose-material.quantity-title"),
                                0,
                                CurrencyConverter.ToSystemCurrency(
                                    monsterPart.getValue(),
                                ),
                            )
                        )?.value ?? 0,
                    );
                    if (!addedValue) return;
                    const valueSingle = monsterPart.getValue(1);
                    const consumedItems = Math.floor(
                        (addedValue as number) / (valueSingle as number),
                    );
                    const consumedValue = (
                        (addedValue as number) -
                        (monsterPart.getValue(consumedItems) as number)
                    ).toNearest(0.01) as NormalizedValue;
                    if (
                        await dialogs.confirmApplyMaterial(
                            addedValue,
                            i18nFormat(
                                getMaterialLabel(selectedMaterial) ?? "",
                            ) as string,
                            consumedItems,
                            consumedValue,
                        )
                    ) {
                        if (expectedMaterial === "") {
                            this.data.imbues.push({
                                selected: selectedMaterial,
                                value: addedValue,
                            });
                            await this.updateItem();
                        } else {
                            const m =
                                this.data.refinement.selected ==
                                selectedMaterial
                                    ? this.data.refinement
                                    : this.data.imbues.find(
                                          (i) => i.selected == selectedMaterial,
                                      );
                            if (!m) return;
                            m.value = ((m.value as number) +
                                (addedValue as number)) as NormalizedValue;
                        }
                        await this.updateItem();
                        this.render();
                        if (monsterPart.isOwnedByActor) {
                            if ((consumedValue as number).toNearest(0.01) > 0) {
                                const data = monsterPart.item.toObject();
                                (data.flags["pf2e-monster-parts"][
                                    "monster-part"
                                ] as ModuleFlags["monster-part"])!.value =
                                    ((valueSingle as number) -
                                        (consumedValue as number)) as NormalizedValue;
                                data.system.quantity = 1;
                                monsterPart.item.actor?.createEmbeddedDocuments(
                                    "Item",
                                    [data],
                                );
                            }
                            const remainingQuantity =
                                monsterPart.quantity -
                                (consumedItems + (consumedValue as number) > 0
                                    ? 1
                                    : 0);
                            if (remainingQuantity > 0) {
                                await monsterPart.setQuantity(
                                    remainingQuantity,
                                );
                            } else {
                                monsterPart.item.actor?.deleteEmbeddedDocuments(
                                    "Item",
                                    [monsterPart.item.id],
                                );
                            }
                        }
                    }
                });
            });
    }
}

export async function configureRefinedItem(item: RefinedItem) {
    const config = getConfig();
    const rollOptions = item.getRollOptions();
    const flag = item.getFlag();

    const possibleMaterials = [
        ...config.materials
            .values()
            .map((m) => new Material(m))
            .filter((m) => m.testItem({ rollOptions })),
    ];

    const data: RefinedItemEditorData = {
        possibleRefinements: possibleMaterials
            .filter((m) => m.type == "refinement")
            .map((m) => ({ key: m.key, label: i18nFormat(m.label) }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        possibleImbues: possibleMaterials
            .filter((m) => m.type == "imbuement")
            .map((m) => ({ key: m.key, label: i18nFormat(m.label) }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        refinement: {
            selected:
                Material.fromKey(flag.refinement.key)?.key ??
                flag.refinement.key,
            value: flag.refinement.value,
            isDisabled: AutomaticRefinementProgression.isEnabled,
        },
        imbues: flag.imbues.map((i) => ({
            selected: Material.fromKey(i.key)?.key ?? i.key,
            value: i.value,
        })),
        item,
    };

    const promise = new Promise<void>((resolve) => {
        new RefinedItemEditor({
            data,
            form: { handler: async () => resolve() },
            window: {
                title: t("material.editor.title") as string,
            },
        }).render(true);
    });
    await promise;
    /*const newFlag = {
        refinement: {
            key: data.refinement.selected,
            value: data.refinement.value,
        },
        imbues: data.imbues.map((i) => ({
            key: i.selected,
            value: i.value,
        })),
    };
    await item.item.setFlag(MODULE_ID, "refined-item", newFlag);
    return item.updateItem();*/
}
