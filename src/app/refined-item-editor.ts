import { ItemPF2e } from "foundry-pf2e";
import { getConfig } from "../config";
import { i18nFormat, t } from "../utils";
import {
    ApplicationConfiguration,
    ApplicationRenderContext,
    ApplicationRenderOptions,
} from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import { MODULE_ID } from "../module";
import { getExtendedItemRollOptions } from "../itemUtil";
import { RefinedItemFlags } from "../flags";
import { prepareRefinedItem } from "../item";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface RefinedItemEditorData {
    possibleRefinements: { key: string; label: string }[];
    possibleImbues: { key: string; label: string }[];
    refinement: { selected: string; value: number };
    imbues: { selected: string; value: number }[];
}

class RefinedItemEditor extends HandlebarsApplicationMixin(ApplicationV2) {
    data: RefinedItemEditorData;

    constructor(
        options: DeepPartial<ApplicationConfiguration> & {
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

    _onRender(
        context: ApplicationRenderContext,
        options: ApplicationRenderOptions,
    ): void {
        this.element
            .querySelector("select.refinement-type")
            ?.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (e.target.value) {
                    this.data.refinement.selected = e.target.value;
                }
            });
        this.element
            .querySelector("input.refinement-value")
            ?.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.data.refinement.value = e.target.value ?? 0;
            });

        this.element
            .querySelectorAll("select.imbue-type")
            .forEach((element, i) => {
                element.addEventListener("change", (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (e.target.value) {
                        this.data.imbues[i].selected = e.target.value;
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
                    this.data.imbues[i].value = e.target.value ?? 0;
                });
            });

        const newImbue = this.element.querySelector(
            "select#new-imbue-type",
        ) as HTMLSelectElement;
        newImbue.addEventListener("change", (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (e.target.value) {
                this.data.imbues.push({
                    selected: e.target.value,
                    value: 0,
                });
            }
            this.render();
        });
    }
}

export async function configureRefinedItem(item: ItemPF2e) {
    const config = getConfig();
    const rollOptions = getExtendedItemRollOptions(item);
    const flag = item.getFlag(MODULE_ID, "refinedItem");
    if (!flag) {
        ui.notifications.error("Expected refined item data");
        throw new Error(
            "Refined item editor window expected refined item data but did not find any",
        );
    }

    const data: RefinedItemEditorData = {
        possibleRefinements: config.materials
            .filter(
                (m) =>
                    m.type === "refinement" &&
                    new game.pf2e.Predicate(m.itemPredicate).test(rollOptions),
            )
            .map((m) => ({ key: m.key, label: i18nFormat(m.label) }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        possibleImbues: config.materials
            .filter(
                (m) =>
                    m.type === "imbue" &&
                    new game.pf2e.Predicate(m.itemPredicate).test(rollOptions),
            )
            .map((m) => ({ key: m.key, label: i18nFormat(m.label) }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        refinement: {
            selected: flag.refinement.key,
            value: flag.refinement.value,
        },
        imbues: flag.imbues.map((i) => ({
            selected: i.key,
            value: i.value,
        })),
    };

    const promise = new Promise((resolve) => {
        new RefinedItemEditor({
            data,
            form: { handler: resolve },
            window: {
                title: t("Material.Editor.Title"),
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
    await item.setFlag(MODULE_ID, "refinedItem", newFlag);
    return prepareRefinedItem(item);
}
