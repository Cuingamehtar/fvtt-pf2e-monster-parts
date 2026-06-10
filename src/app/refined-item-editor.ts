import { getConfig } from "../config";
import { getDroppedItem, i18nFormat, t, Utils } from "../utils";
import { RefinedItem } from "../refined-item";
import { Material, MaterialValue } from "../material";
import { dialogs } from "./dialogs";
import { MonsterPart } from "../monster-part";
import { AutomaticRefinementProgression } from "../modules/automatic-refinement-progression";
import { ModuleFlags, RefinedItemFlags } from "../../types/global";
import { AssignMaterialDialog } from "@src/app/assign-material-dialog";
import { ExtractMaterialDialog } from "@src/app/extract-material-dialog";
import * as R from "remeda";
import { ApplicationRenderContext } from "foundry-pf2e";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface RefinedItemEditorData {
    item: RefinedItem;
}

class RefinedItemEditor extends HandlebarsApplicationMixin(ApplicationV2) {
    item: RefinedItem;

    possibleRefinements: { key: MaterialKey; label: I18nString }[];
    possibleImbuements: { key: MaterialKey; label: I18nString }[];

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> &
            RefinedItemEditorData,
    ) {
        options.uniqueId = `refined-item-editor-${options.item.item.id}`;
        super(options);
        this.item = options.item;

        const rollOptions = this.item.getRollOptions();
        [this.possibleRefinements, this.possibleImbuements] = R.pipe(
            Array.from(getConfig().materials.keys()),
            R.map((k) => Material.fromKey(k)),
            R.filter((m) => m.testItem({ rollOptions })),
            R.map((m) => ({
                type: m.type,
                key: m.key,
                label: i18nFormat(m.label),
            })),
            R.sort((a, b) => a.label.localeCompare(b.label)),
            R.partition((m) => m.type === "refinement"),
        );
    }

    async updateItem(updatedFlag: DeepPartial<RefinedItemFlags>) {
        const flag = this.item.getFlag();
        await this.item.updateItem(
            foundry.utils.mergeObject(flag, updatedFlag, {
                inplace: false,
            }),
        );
        await this.render();
    }

    getMaterial(key?: string) {
        if (!key) return undefined;
        return this.item.refinement.key === key
            ? this.item.refinement
            : this.item.imbuements.find((imb) => imb.key === key);
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
            handler: RefinedItemEditor.#submitFormHandler,
        },
        window: {
            title: "pf2e-monster-parts.material.editor.title",
            contentClasses: ["standard-form"],
            width: 400,
            height: 600,
            closeOnSubmit: true,
        },
    };

    async _prepareContext(): Promise<RefinedItemEditorContext> {
        const usedImbuements = this.item.imbuements.map((e) => e.key);
        return {
            possibleRefinements: this.possibleRefinements,
            possibleImbuements: this.possibleImbuements,
            refinement: {
                key: this.item.refinement.key,
                value: this.item.refinement.value.toSystemCurrency(),
                disabled: AutomaticRefinementProgression.isEnabled,
            },
            imbuements: this.item.imbuements.map((i) => ({
                key: i.key,
                value: i.value.toSystemCurrency(),
                allowed: this.possibleImbuements.filter(
                    (e) => !usedImbuements.includes(e.key) || i.key == e.key,
                ),
            })),
            newImbuements: this.possibleImbuements.filter(
                (e) => !usedImbuements.includes(e.key),
            ),
            currencyLabel: Utils.currencyLabel,
        };
    }

    static async #submitFormHandler(
        this: RefinedItemEditor,
        _event: Event,
        _form: HTMLFormElement,
        formData: foundry.applications.ux.FormDataExtended,
    ) {
        const data = formData.object;
        const refinement = {
            key: data["refinement-type"] as MaterialKey,
            value: MaterialValue.fromSystemCurrency(
                data["refinement-value"] as number,
            ).gp,
        };
        const imbuements = [];
        for (let i = 0; `imbue-${i}-type` in data; ++i) {
            if (data[`imbue-${i}-type`] === "") continue;
            imbuements.push({
                key: data[`imbue-${i}-type`] as MaterialKey,
                value: MaterialValue.fromSystemCurrency(
                    data[`imbue-${i}-value`] as number,
                ).gp,
            });
        }
        if (data["new-imbue-type"]) {
            imbuements.push({
                key: data["new-imbue-type"] as MaterialKey,
                value: MaterialValue.fromSystemCurrency(
                    data["new-imbue-value"] as number,
                ).gp,
            });
        }
        await this.updateItem({
            refinement,
            imbues: imbuements,
        });

        await this.render(true);
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
            material,
        });

        if (subtracted.gp == 0) return;
        const input = button.parentElement?.querySelector("input");
        if (input)
            input.value = String(
                material.value.sub(subtracted).toSystemCurrency(),
            );

        const owner = this.item.item.parent;
        const m = Material.fromKey(material.key, extracted.gp);
        if (owner && m) {
            await MonsterPart.fromPureMaterial(owner, m);
        }
    }

    override async _onRender(context: RefinedItemEditorContext) {
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
                                      this.possibleImbuements.filter(
                                          (i) =>
                                              monsterPart.materials.includes(
                                                  i.key,
                                              ) &&
                                              !context.imbuements.some(
                                                  (e) => e.key == i.key,
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
                        [this.item.refinement, ...this.item.imbuements].find(
                            (m) => m.key == selectedMaterial,
                        ) ?? Material.fromKey(selectedMaterial);
                    if (!existingMaterial) return;
                    const { value, remainder, goneFromStack } =
                        await AssignMaterialDialog.create({
                            monsterPart,
                            refinedItem: this.item,
                            material: existingMaterial,
                        });
                    if (!value || value.gp == 0) return;
                    if (expectedMaterial === "") {
                        element.querySelector("select")!.value =
                            selectedMaterial;
                        element.querySelector("input")!.value = String(
                            value.toSystemCurrency(),
                        );
                        this.form?.submit();
                    } else {
                        const input = element.querySelector("input")!;
                        input.value = String(
                            Number(input.value) + value.toSystemCurrency(),
                        );
                        this.form?.submit();
                    }
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

type MaterialKeyLabel = { key: MaterialKey; label: I18nString };
interface RefinedItemEditorContext extends ApplicationRenderContext {
    possibleRefinements: MaterialKeyLabel[];
    possibleImbuements: MaterialKeyLabel[];
    refinement: { key: MaterialKey; value: number; disabled: boolean };
    imbuements: {
        key: MaterialKey;
        value: number;
        allowed: MaterialKeyLabel[];
    }[];
    newImbuements: MaterialKeyLabel[];
    currencyLabel: I18nString;
}

export async function configureRefinedItem(item: RefinedItem) {
    await new RefinedItemEditor({ item }).render(true);
}
