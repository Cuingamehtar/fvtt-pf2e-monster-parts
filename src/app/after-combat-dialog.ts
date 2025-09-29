import { EncounterPF2e, NPCPF2e, TokenDocumentPF2e } from "foundry-pf2e";
import { MonsterPart } from "../monster-part";
import { MODULE_ID } from "../module";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export function registerEndCombatDialog() {
    if (
        !game.user.isActiveGM ||
        game.settings.get(MODULE_ID, "monster-parts-after-combat") == "none"
    )
        return;
    Hooks.on("deleteCombat", async (combat: EncounterPF2e) => {
        const combatants = combat.combatants;
        const npcs = combatants
            .filter((c) => (c.token && c.actor?.isOfType("npc")) ?? false)
            .map((e) => ({
                token: e.token!,
                actor: e.actor! as NPCPF2e,
                value: MonsterPart.valueOfCreature(e.actor as NPCPF2e),
                checked: e.actor!.isDead,
            }));
        if (npcs.length == 0) return;
        const settings = game.settings.get(
            MODULE_ID,
            "monster-parts-after-combat",
        );
        const dialogResult =
            settings == "dialog"
                ? ((await new Promise((resolve) => {
                      const d = new AfterCombatDialog({
                          npcs,
                          form: {
                              handler: async (
                                  _event: Event | SubmitEvent,
                                  _form: HTMLFormElement,
                                  _formData: foundry.applications.ux.FormDataExtended,
                              ) => resolve(d.npcs),
                          },
                      });
                      d.render(true);
                  })) as typeof npcs | undefined)
                : npcs;

        if (!dialogResult) return;
        dialogResult
            .filter((e) => e.checked)
            .forEach((e) => MonsterPart.fromCreature(e.actor));
    });
}

class AfterCombatDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    npcs;

    constructor(
        options: DeepPartial<foundry.applications.ApplicationConfiguration> & {
            npcs: {
                token: TokenDocumentPF2e;
                actor: NPCPF2e;
                value: number;
                checked: boolean;
            }[];
        },
    ) {
        super(options);
        this.npcs = options.npcs;
    }

    static PARTS = {
        form: {
            template:
                "modules/pf2e-monster-parts/templates/after-combat-dialog.hbs",
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
            title: "pf2e-monster-parts.dialog.after-combat-dialog.title",
            closeOnSubmit: true,
        },
    };

    override async _onRender(
        _context: object,
        _options: foundry.applications.ApplicationRenderOptions,
    ) {
        this.element
            .querySelectorAll("input[type=checkbox]")
            .forEach((element) => {
                element.addEventListener("change", (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const npc = this.npcs.find(
                        (npc) => element.id == npc.token.id,
                    );
                    if (!npc) return;
                    npc.checked = element.checked;
                    this.render();
                });
            });
    }

    override async _prepareContext() {
        const actors = this.npcs.map((e) => ({
            name: e.token.name,
            id: e.token.id,
            value: e.value,
            checked: e.checked,
        }));

        const buttons = [
            {
                type: "submit",
                icon: "fa-solid fa-check",
                label: "Confirm",
            },
        ];
        return {
            data: {
                actors,
                totalValue: actors
                    .filter((e) => e.checked)
                    .reduce((acc, e) => acc + e.value, 0),
            },
            buttons,
        };
    }
}
