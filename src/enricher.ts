import { PhysicalItemPF2e } from "foundry-pf2e";
import { getEffects } from "./refined-item";
import { i18nFormat } from "./utils";
import { MODULE_ID } from "./module";

export function registerEnricher(): void {
    libWrapper.register(
        MODULE_ID,
        "CONFIG.PF2E.Item.documentClasses.weapon.prototype.getDescription",
        async function (
            this: PhysicalItemPF2e,
            wrapped: (options: any) => Promise<{
                value: string;
                gm: string;
            }>,
            args: any,
        ) {
            const description = await wrapped(args);
            if (!this.getFlag(MODULE_ID, "refined-item")) return description;
            const effects = getEffects(this);
            const text = effects.map((m) => {
                const notes = m.effects
                    .filter((e) => e.key === "InlineNote")
                    .map((e) => `<li>${i18nFormat(e.text, e.parameters)}</li>`);
                const contents =
                    notes.length === 0 ? `` : `<ul>${notes.join("")}</ul>`;
                return {
                    title: `${i18nFormat(m.label)} Level ${m.level} (${m.value} gp)`,
                    text: contents,
                };
            });
            const header = "Refined item description";

            const templatePath =
                "systems/pf2e/templates/items/partials/addendum.hbs";
            const addedValue = await foundry.applications.handlebars
                .renderTemplate(templatePath, {
                    addendum: {
                        label: header,
                        contents: text,
                    },
                })
                .then((e: string) =>
                    foundry.applications.ux.TextEditor.implementation.enrichHTML(
                        e,
                    ),
                );
            description.value = addedValue + description.value;
            return description;
        },
    );
}
