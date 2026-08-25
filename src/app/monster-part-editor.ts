import { getConfig } from "../config";
import { i18nFormat, t, Utils } from "../utils";
import { MODULE_ID } from "../module";
import { MonsterPart } from "../monster-part";
import { MaterialValue } from "@src/material";
import * as R from "remeda";
import { ApplicationRenderContext } from "foundry-pf2e";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class MonsterPartEditor extends HandlebarsApplicationMixin(ApplicationV2) {
    item: MonsterPart;

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> & {
            item: MonsterPart;
        },
    ) {
        options.form = { handler: MonsterPartEditor.submitForm(options.item) };
        options.id = `monster-part-editor-${options.item.item.id}`;
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

    override async _prepareContext(): Promise<MonsterPartEditorContext> {
        const config = getConfig();
        const flags = this.item.getFlag() ?? {
            materials: [],
            value: 0,
        };

        const [refinements, imbuements] = R.pipe(
            Array.from(config.materials.values()),
            R.map((m) => ({
                type: m.type,
                key: m.key,
                label: i18nFormat(m.label),
                checked: flags.materials.includes(m.key),
            })),
            R.sort((a, b) => a.label.localeCompare(b.label)),
            R.partition((m) => m.type === "refinement"),
        );

        return {
            value: new MaterialValue(flags.value).toSystemCurrency(),
            refinements,
            imbuements,
            currencyLabel: Utils.currencyLabel,
        };
    }
    static submitForm(item: MonsterPart) {
        return async function (
            _event: Event | SubmitEvent,
            _form: HTMLFormElement,
            formData: foundry.applications.ux.FormDataExtended,
        ) {
            const data = formData.object;
            const config = getConfig();
            const flags = {
                value: MaterialValue.fromSystemCurrency(
                    data["material-value"] as number,
                ).gp,
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

type MaterialEntry = { key: MaterialKey; label: I18nString; checked: boolean };

interface MonsterPartEditorContext extends ApplicationRenderContext {
    value: number;
    refinements: MaterialEntry[];
    imbuements: MaterialEntry[];
    currencyLabel: I18nString;
}
