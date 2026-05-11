import { getConfig } from "../config";
import { getDroppedItem, i18nFormat, t } from "../utils";
import { RefinedItem } from "../refined-item";
import { Material, MaterialValue } from "../material";
import { dialogs } from "./dialogs";
import { MonsterPart } from "../monster-part";
import { AutomaticRefinementProgression } from "../automatic-refinement-progression";
import { ModuleFlags, RefinedItemFlags } from "../../types/global";
import { AssignMaterialDialog } from "@src/app/assign-material-dialog";
import { ExtractMaterialDialog } from "@src/app/extract-material-dialog";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface RefinedItemEditorData {
    possibleRefinements: { key: MaterialKey; label: I18nString | I18nKey }[];
    possibleImbues: { key: MaterialKey; label: I18nString | I18nKey }[];
    refinement: {
        selected: MaterialKey;
        value: MaterialValue;
        isDisabled: boolean;
    };
    imbues: { selected: MaterialKey; value: MaterialValue }[];
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
                value: this.data.refinement.value.gp,
            },
            imbues: this.data.imbues.map((i) => ({
                key: i.selected,
                value: i.value.gp,
            })),
        };
    }

    getMaterial(key?: string) {
        if (!key) return undefined;
        return this.data.refinement.selected === key
            ? this.data.refinement
            : this.data.imbues.find((imb) => imb.selected === key);
    }

    static PARTS = {
        form: {
            template:
                "modules/pf2e-monster-parts/templates/refined-item-editor.hbs",
        },
    };

    static DEFAULT_OPTIONS = {
        tag: "form",
        actions: {
            extractMaterial: RefinedItemEditor.#extractMaterial,
        },
        form: {
            submitOnChange: true,
            closeOnSubmit: false,
        },
        window: {
            contentClasses: ["standard-form"],
            title: "",
            width: 400,
            height: 600,
            closeOnSubmit: true,
        },
    };

    // @ts-expect-error
    async _prepareContext() {
        const usedImbues = this.data.imbues.map((e) => e.selected);
        return {
            data: {
                possibleRefinements: this.data.possibleRefinements,
                possibleImbues: this.data.possibleImbues,
                refinement: {
                    selected: this.data.refinement.selected,
                    value: this.data.refinement.value.toSystemCurrency(),
                },
                imbues: this.data.imbues.map((i) => ({
                    selected: i.selected,
                    value: i.value.toSystemCurrency(),
                    allowed: this.data.possibleImbues.filter(
                        (e) =>
                            !usedImbues.includes(e.key) || i.selected == e.key,
                    ),
                })),
                newImbues: this.data.possibleImbues.filter(
                    (e) => !usedImbues.includes(e.key),
                ),
            },
        };
    }

    static async #extractMaterial(
        this: RefinedItemEditor,
        event: PointerEvent,
    ) {
        const button = (event.target as HTMLElement)?.closest("button");
        if (!button) return;
        const material = this.getMaterial(button.dataset.materialKey);
        if (!material) return;

        const { subtracted, extracted } = await ExtractMaterialDialog.create({
            material: Material.fromKey(material.selected, material.value.gp),
            refinedItem: this.data.item,
        });

        if (subtracted.gp == 0) return;
        material.value = material.value.sub(subtracted);
        await this.updateItem();
        await this.render();

        const owner = this.data.item.item.parent;
        const m = Material.fromKey(material.selected, extracted.gp);
        if (owner && m) {
            await MonsterPart.fromPureMaterial(owner, m);
        }
    }

    override async _onRender(
        _context: object,
        _options: foundry.applications.ApplicationRenderOptions,
    ) {
        const usedImbues = this.data.imbues.map((e) => e.selected);
        foundry.utils.mergeObject(
            _context,
            {
                refinement: {
                    selected: this.data.refinement.selected,
                    value: this.data.refinement.value.toSystemCurrency(),
                },
                imbues: this.data.imbues.map((i) => ({
                    selected: i.selected,
                    value: i.value.toSystemCurrency(),
                    allowed: this.data.possibleImbues.filter(
                        (e) =>
                            !usedImbues.includes(e.key) || i.selected == e.key,
                    ),
                })),
                newImbues: this.data.possibleImbues.filter(
                    (e) => !usedImbues.includes(e.key),
                ),
            },
            { inplace: true },
        );
        this.element
            .querySelector("select.refinement-type")
            ?.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                if ((e.target as any).value) {
                    this.data.refinement.selected = (e.target as any).value;
                    this.updateItem();
                }
                this.render();
            });
        this.element
            .querySelector("input#refinement-value")
            ?.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.data.refinement.value = MaterialValue.fromSystemCurrency(
                    Number((e.target as any).value),
                );
                this.updateItem();
                this.render();
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
                    this.render();
                });
            });

        this.element
            .querySelectorAll("input.imbue-value")
            .forEach((element, i) => {
                element.addEventListener("change", (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.data.imbues[i].value =
                        MaterialValue.fromSystemCurrency(
                            Number((e.target as any).value),
                        );
                    this.updateItem();
                    this.render();
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
                    value: new MaterialValue(0),
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
                    const existingMaterial =
                        [
                            this.data.item.refinement,
                            ...this.data.item.imbuements,
                        ]
                            .filter((m): m is Material => Boolean(m))
                            .find((m) => m.key == selectedMaterial) ??
                        Material.fromKey(selectedMaterial);
                    if (!existingMaterial) return;
                    const nextLevelValue = existingMaterial
                        .getThresholdForLevel(
                            this.data.item,
                            existingMaterial.getLevel(this.data.item).value + 1,
                        )
                        .sub(existingMaterial.value);
                    const { value, remainder, goneFromStack } =
                        await AssignMaterialDialog.create({
                            monsterPart,
                            nextLevelValue:
                                nextLevelValue.gp <= 0
                                    ? undefined
                                    : nextLevelValue,
                        });
                    if (!value || value.gp == 0) return;
                    if (expectedMaterial === "") {
                        this.data.imbues.push({
                            selected: selectedMaterial,
                            value: value,
                        });
                    } else {
                        const m =
                            this.data.refinement.selected == selectedMaterial
                                ? this.data.refinement
                                : this.data.imbues.find(
                                      (i) => i.selected == selectedMaterial,
                                  );
                        if (!m) return;
                        m.value = m.value.add(value);
                    }
                    await this.updateItem();
                    await this.render();
                    if (monsterPart.isOwnedByActor) {
                        if (remainder.gp > 0) {
                            const data = monsterPart.item.toObject();
                            data.name = t("material.item.name-partial", {
                                name: data.name,
                            }) as string;
                            (data.flags["pf2e-monster-parts"][
                                "monster-part"
                            ] as ModuleFlags["monster-part"])!.value =
                                remainder.round().gp;
                            data.system.quantity = 1;
                            monsterPart.item.actor?.createEmbeddedDocuments(
                                "Item",
                                [data],
                            );
                        }
                        const remainingQuantity =
                            monsterPart.quantity - goneFromStack;
                        if (remainingQuantity > 0) {
                            await monsterPart.setQuantity(remainingQuantity);
                        } else {
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

    const possibleMaterials = [
        ...config.materials
            .values()
            .map((m) => new Material(m))
            .filter((m) => m.testItem({ rollOptions }))
            .map((m) => ({
                type: m.type,
                key: m.key,
                label: i18nFormat(m.label),
            })),
    ].sort((a, b) => a.label.localeCompare(b.label));

    const data: RefinedItemEditorData = {
        possibleRefinements: possibleMaterials.filter(
            (m) => m.type == "refinement",
        ),
        possibleImbues: possibleMaterials.filter((m) => m.type == "imbuement"),
        refinement: {
            selected:
                Material.fromKey(flag.refinement.key)?.key ??
                flag.refinement.key,
            value: new MaterialValue(flag.refinement.value),
            isDisabled: AutomaticRefinementProgression.isEnabled,
        },
        imbues: flag.imbues.map((i) => ({
            selected: Material.fromKey(i.key)?.key ?? i.key,
            value: new MaterialValue(i.value),
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
