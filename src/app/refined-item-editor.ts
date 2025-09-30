import { getConfig, getMaterialLabel } from "../config";
import { getDroppedItem, i18nFormat, t } from "../utils";
import { MODULE_ID } from "../module";
import { RefinedItem } from "../refined-item";
import { Material } from "../material";
import { dialogs } from "./dialogs";
import { MonsterPart } from "../monster-part";
import { AutomaticRefinementProgression } from "../automatic-refinement-progression";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface RefinedItemEditorData {
    possibleRefinements: { key: MaterialKey; label: I18nString | I18nKey }[];
    possibleImbues: { key: MaterialKey; label: I18nString | I18nKey }[];
    refinement: { selected: MaterialKey; value: number };
    imbues: { selected: MaterialKey; value: number }[];
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

    static PARTS = {
        form: {
            template:
                "modules/pf2e-monster-parts/templates/refined-item-editor.hbs",
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        },
    };

    static DEFAULT_OPTIONS = {
        tag: "form",
        form: {
            submitOnChange: false,
            closeOnSubmit: true,
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
        const buttons = [
            {
                type: "submit",
                icon: "fa-solid fa-save",
                label: "SETTINGS.Save",
            },
        ];
        return {
            data: this.data,
            buttons,
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
                }
            });
        this.element
            .querySelector("input#refinement-value")
            ?.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.data.refinement.value = Number((e.target as any).value);
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
                });
            });

        this.element
            .querySelectorAll("input.imbue-value")
            .forEach((element, i) => {
                element.addEventListener("change", (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.data.imbues[i].value = Number((e.target as any).value);
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

                    const flag = item.getFlag(MODULE_ID, "monster-part");
                    if (!flag) {
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
                    const itemCount =
                        monsterPart.quantity == 1
                            ? 1
                            : (
                                  await dialogs.slider(
                                      t(
                                          "dialog.choose-material.quantity-title",
                                      ),
                                      monsterPart.quantity,
                                      1,
                                      monsterPart.quantity,
                                  )
                              )?.value;
                    if (!itemCount) return;
                    const addedValue = monsterPart.getValue(itemCount);
                    if (
                        await dialogs.confirm(
                            t("dialog.confirm-apply-material.title"),
                            t("dialog.confirm-apply-material.content", {
                                value: addedValue,
                                quantity: itemCount,
                                material: i18nFormat(
                                    getMaterialLabel(selectedMaterial) ?? "",
                                ),
                            }),
                        )
                    ) {
                        if (expectedMaterial === "") {
                            this.data.imbues.push({
                                selected: selectedMaterial,
                                value: addedValue,
                            });
                        } else {
                            const m =
                                this.data.refinement.selected ==
                                selectedMaterial
                                    ? this.data.refinement
                                    : this.data.imbues.find(
                                          (i) => i.selected == selectedMaterial,
                                      );
                            if (!m) return;
                            m.value += addedValue;
                        }
                        this.render();
                        if (monsterPart.isOwnedByActor) {
                            await monsterPart.setQuantity(
                                monsterPart.quantity - itemCount,
                            );
                            if (monsterPart.quantity <= 0)
                                monsterPart.item.actor?.deleteEmbeddedDocuments(
                                    "Item",
                                    [monsterPart.item.id],
                                );
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

    const data: RefinedItemEditorData = {
        possibleRefinements: [
            ...config.materials
                .values()
                .filter(
                    (m) =>
                        m.type === "refinement" &&
                        new Material(m).testItem({ rollOptions }),
                )
                .map((m) => ({ key: m.key, label: i18nFormat(m.label) })),
        ].sort((a, b) => a.label.localeCompare(b.label)),
        possibleImbues: [
            ...config.materials
                .values()
                .filter(
                    (m) =>
                        m.type === "imbuement" &&
                        new Material(m).testItem({ rollOptions }),
                )
                .map((m) => ({ key: m.key, label: i18nFormat(m.label) })),
        ].sort((a, b) => a.label.localeCompare(b.label)),
        refinement: {
            selected: flag.refinement.key,
            value: flag.refinement.value,
            isDisabled: AutomaticRefinementProgression.isEnabled,
        },
        imbues: flag.imbues.map((i) => ({
            selected: i.key,
            value: i.value,
        })),
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
    const newFlag = {
        refinement: {
            key: data.refinement.selected,
            value: data.refinement.value,
        },
        imbues: data.imbues.map((i) => ({ key: i.selected, value: i.value })),
    };
    await item.item.setFlag(MODULE_ID, "refined-item", newFlag);
    return item.updateItem();
}
