import { ItemPF2e } from "foundry-pf2e";
import { getConfig } from "../config";
import { t } from "../utils";
import { ApplicationConfiguration } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import { MODULE_ID } from "../module";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class MonsterPartEditor extends HandlebarsApplicationMixin(ApplicationV2) {
    item: ItemPF2e;

    constructor(
        options: DeepPartial<ApplicationConfiguration> & { item: ItemPF2e },
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
            width: 550,
            height: 600,
            closeOnSubmit: true,
        },
    };

    async _prepareContext() {
        const config = getConfig();
        const flags = this.item.getFlag(MODULE_ID, "monsterPart") ?? {
            materials: [],
            value: 0,
        };

        const refinements = [...config.materials.values()]
            .filter((m) => m.type === "refinement")
            .map((m) => ({
                key: m.key,
                label: m.label,
                checked: flags.materials.includes(m.key),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        const imbues = [...config.materials.values()]
            .filter((m) => m.type === "imbue")
            .map((m) => ({
                key: m.key,
                label: m.label,
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

export async function configureMonsterPart(item: ItemPF2e) {
    const promise = new Promise((resolve) => {
        new MonsterPartEditor({
            item,
            form: {
                handler: async (
                    event: Event | SubmitEvent,
                    form: HTMLFormElement,
                    formData: FormDataExtended,
                ) => resolve(formData.object),
            },
            window: {
                title: t("Material.Editor.Title") as string,
            },
        }).render(true);
    });
    const data = (await promise) as any;
    const config = getConfig();
    const flags = {
        value: data["material-value"] as number,
        materials: [...config.materials.values()]
            .filter((m) => data[m.key])
            .map((m) => m.key),
    };
    if (item) item.setFlag(MODULE_ID, "monsterPart", flags);
}
