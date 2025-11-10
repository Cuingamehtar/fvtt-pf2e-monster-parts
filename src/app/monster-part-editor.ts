import { getConfig } from "../config";
import { i18nFormat, t } from "../utils";
import { MODULE_ID } from "../module";
import { MonsterPart } from "../monster-part";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class MonsterPartEditor extends HandlebarsApplicationMixin(ApplicationV2) {
    item: MonsterPart;

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> & {
            item: MonsterPart;
        },
    ) {
        options.form = { handler: MonsterPartEditor.submitForm(options.item) };
        super(options);
        this.item = options.item;
    }

    static PARTS = {
        form: {
            template:
                "modules/pf2e-monster-parts/templates/monster-part-editor.hbs",
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
            width: 350,
            height: 600,
        },
    };

    override async _prepareContext() {
        const config = getConfig();
        const flags = this.item.getFlag() ?? {
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

        return {
            settings: {
                value: flags.value,
                refinements,
                imbues,
            },
        };
    }
    static submitForm(item: MonsterPart) {
        return async function (
            event: Event | SubmitEvent,
            form: HTMLFormElement,
            formData: foundry.applications.ux.FormDataExtended,
        ) {
            const data = formData.object;
            const config = getConfig();
            const flags = {
                value: data["material-value"] as number,
                materials: [...config.materials.values()]
                    .filter((m) => data[m.key as keyof typeof data])
                    .map((m) => m.key),
            };
            await item.item.setFlag(MODULE_ID, "monster-part", flags);
        };
    }
}

export async function configureMonsterPart(item: MonsterPart) {
    await new MonsterPartEditor({
        item: item,
        window: {
            title: t("material.editor.title") as string,
        },
    }).render(true);
}
