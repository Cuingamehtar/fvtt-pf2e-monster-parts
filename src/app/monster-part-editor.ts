import { ItemPF2e } from "foundry-pf2e";
import { getConfig } from "../config";
import { i18nFormat, t } from "../utils";
import { MODULE_ID } from "../module";
import { MonsterPart } from "../monster-part";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class MonsterPartEditor extends HandlebarsApplicationMixin(ApplicationV2) {
    item: ItemPF2e;

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> & {
            item: ItemPF2e;
        },
    ) {
        super(options);
        this.item = options.item;
    }

    static PARTS = {
        form: {
            template:
                "modules/pf2e-monster-parts/templates/monster-part-editor.hbs",
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
            width: 350,
            height: 600,
            closeOnSubmit: true,
            controls: [
                {
                    icon: "fa-solid fa-book-open",
                    label: "pf2e-monster-parts.dialog.monster-part-editor.imbuements",
                    onClick: () =>
                        game.modules.get(MODULE_ID).api.renderSummaryJournal(),
                },
            ],
        },
    };

    override async _prepareContext() {
        const config = getConfig();
        const flags = this.item.getFlag(MODULE_ID, "monster-part") ?? {
            materials: [],
            value: 0,
        };

        const refinements = [...config.materials.values()]
            .filter((m) => m.type === "refinement")
            .map((m) => ({
                key: m.key,
                label: i18nFormat(m.label),
                checked: flags.materials.includes(m.key),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        const imbues = [...config.materials.values()]
            .filter((m) => m.type === "imbuement")
            .map((m) => ({
                key: m.key,
                label: i18nFormat(m.label),
                checked: flags.materials.includes(m.key),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        const buttons = [
            {
                type: "submit",
                icon: "fa-solid fa-save",
                label: "SETTINGS.Save",
            },
        ];
        return {
            settings: {
                value: flags.value,
                refinements,
                imbues,
            },
            buttons,
        };
    }
}

export async function configureMonsterPart(item: MonsterPart) {
    const promise = new Promise((resolve) => {
        new MonsterPartEditor({
            item: item.item,
            form: {
                handler: async (
                    event: Event | SubmitEvent,
                    form: HTMLFormElement,
                    formData: foundry.applications.ux.FormDataExtended,
                ) => resolve(formData.object),
            },
            window: {
                title: t("material.editor.title") as string,
            },
        }).render(true);
    });
    const data = (await promise) as any;
    console.log(data);
    const config = getConfig();
    const flags = {
        value: data["material-value"] as number,
        materials: [...config.materials.values()]
            .filter((m) => data[m.key as keyof typeof data])
            .map((m) => m.key),
    };
    if (item.item) item.item.setFlag(MODULE_ID, "monster-part", flags);
}
