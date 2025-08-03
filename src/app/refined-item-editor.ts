import { ItemPF2e } from "foundry-pf2e";
import { getConfig, getMaterialLabel } from "../config";
import { getDroppedItem, i18nFormat, t } from "../utils";
import { MODULE_ID } from "../module";
import { getExtendedItemRollOptions } from "../itemUtil";
import { RefinedItemFlags } from "../flags";
import { RefinedItem } from "../refined-item";
import { Material } from "../material";
import { dialogs } from "./dialogs";

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
                    if (!item) return ui.notifications.error("Can't find item");

                    const flag = item.getFlag(MODULE_ID, "monster-part");
                    if (!flag)
                        return ui.notifications.error(
                            "Item is not a recognized monster part",
                        );

                    const expectedMaterial = select.value;
                    if (expectedMaterial === "") {
                        const allowedMaterials =
                            this.data.possibleImbues.filter((i) =>
                                flag.materials.includes(i.key),
                            );
                        const addedMaterial = await dialogs.choice(
                            allowedMaterials,
                            t("dialog.choosematerial.title"),
                        );
                        if (addedMaterial) {
                            this.data.imbues.push({
                                selected: addedMaterial.selected,
                                value: flag.value,
                            });
                            this.render();
                            return item.actor?.deleteEmbeddedDocuments("Item", [
                                item.id,
                            ]);
                        }
                    } else {
                        const expectedMaterialLabel =
                            getMaterialLabel(expectedMaterial) ?? "";
                        if (flag.materials.includes(expectedMaterial)) {
                            const addedValue = flag.value;
                            if (
                                await dialogs.confirm(
                                    t("dialog.confirmapplymaterial.title"),
                                    t("dialog.confirmapplymaterial.content", {
                                        value: addedValue,
                                        material: expectedMaterialLabel,
                                    }),
                                )
                            ) {
                                const input = element.querySelector("input")!;
                                input.value = String(
                                    Number(input.value) + addedValue,
                                );
                                return item.actor?.deleteEmbeddedDocuments(
                                    "Item",
                                    [item.id],
                                );
                            }
                        } else {
                            return ui.notifications.error(
                                "Monster part doesn't contain an applicable material",
                            );
                        }
                    }
                });
            });
    }
}

export async function configureRefinedItem(item: ItemPF2e) {
    const config = getConfig();
    const rollOptions = getExtendedItemRollOptions(item);
    const flag = item.getFlag(MODULE_ID, "refined-item");
    if (!flag) {
        ui.notifications.error("Expected refined item data");
        throw new Error(
            "Refined item editor window expected refined item data but did not find any",
        );
    }

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
                        m.type === "imbue" &&
                        new Material(m).testItem({ rollOptions }),
                )
                .map((m) => ({ key: m.key, label: i18nFormat(m.label) })),
        ].sort((a, b) => a.label.localeCompare(b.label)),
        refinement: {
            selected: flag.refinement.key,
            value: flag.refinement.value,
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
    const newFlag: RefinedItemFlags = {
        refinement: {
            key: data.refinement.selected,
            value: data.refinement.value,
        },
        imbues: data.imbues.map((i) => ({ key: i.selected, value: i.value })),
    };
    await item.setFlag(MODULE_ID, "refined-item", newFlag);
    RefinedItem.prepareItem(item);
}
