import { NPCPF2e, TokenDocumentPF2e } from "foundry-pf2e";
import { simplifyCoins } from "../utils";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class AfterCombatDialog extends HandlebarsApplicationMixin(
    ApplicationV2,
) {
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
            contentClasses: ["standard-form"],
            title: "pf2e-monster-parts.dialog.after-combat-dialog.title",
            closeOnSubmit: true,
        },
    };

    override async _onRender(
        _context: object,
        _options: foundry.applications.ApplicationRenderOptions,
    ) {
        (
            this.element.querySelectorAll(
                "input[type=checkbox]",
            ) as NodeListOf<HTMLInputElement>
        ).forEach((element) => {
            element.addEventListener("change", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                const npc = this.npcs.find((npc) => element.id == npc.token.id);
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
            coins: simplifyCoins(e.value),
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
                totalCoins: simplifyCoins(
                    actors
                        .filter((e) => e.checked)
                        .reduce(
                            (acc, e) => acc.plus(e.coins),
                            new game.pf2e.Coins(),
                        ).copperValue / 100,
                ).toString(),
            },
            buttons,
        };
    }
}
