import {
    CreaturePF2e,
    CreatureSheetPF2e,
    EncounterPF2e,
    ItemSheetPF2e,
    NPCPF2e,
    NPCSheetPF2e,
    PhysicalItemPF2e,
} from "foundry-pf2e";
import { MonsterPart } from "./monster-part";
import { createElement, t } from "./utils";
import { configureMonsterPart } from "./app/monster-part-editor";
import { RefinedItem } from "./refined-item";
import { configureRefinedItem } from "./app/refined-item-editor";
import { createRefinedItemDialog } from "./app/refined-item-create";
import { MODULE_ID } from "./module";
import { AfterCombatDialog } from "./app/after-combat-dialog";

export class ModuleHooks {
    static registerAllHandlers() {
        this.addMonsterPartButton();
        this.addEditItemButton();
        this.addNewRefinedItemButton();
        if (
            game.settings.get(MODULE_ID, "handle-monster-parts-selling") ===
            "none"
        )
            this.hideSellMonsterPartsButton();

        if (
            game.user.isActiveGM &&
            game.settings.get(MODULE_ID, "monster-parts-after-combat") !==
                "none"
        )
            this.registerEndCombatDialog();
    }

    static addMonsterPartButton() {
        Hooks.on(
            "renderNPCSheetPF2e",
            (
                sheet: NPCSheetPF2e,
                html: HTMLDivElement[],
                { editable }: { editable: boolean },
            ) => {
                if (!editable) return;
                const actor = sheet.actor;
                const elem = html[0]
                    ?.querySelector('[data-item-types="treasure"]')
                    ?.previousElementSibling?.querySelector(
                        "div.item-controls",
                    );

                const btn = document.createElement("a");
                btn.innerHTML = '<i class="fa-solid fa-fw fa-skull"></i>';
                btn.classList.add("create-monster-parts");
                btn.setAttribute(
                    "data-tooltip",
                    "pf2e-monster-parts.monster-part.create-button-label",
                );
                btn.addEventListener("click", () =>
                    MonsterPart.fromCreature(actor),
                );

                elem?.insertBefore(btn, elem.firstChild);
            },
        );
    }

    static addEditItemButton() {
        Hooks.on(
            "getItemSheetPF2eHeaderButtons",
            (sheet: ItemSheetPF2e<PhysicalItemPF2e>, buttons) => {
                const item = sheet.object;
                if (MonsterPart.hasMonsterPartData(item)) {
                    buttons.unshift({
                        icon: "fas fa-skull",
                        label: t("dialog.monster-part-editor.button"),
                        class: "configure-monster-part",
                        onclick: () =>
                            configureMonsterPart(new MonsterPart(item)),
                    });
                }
                if (RefinedItem.hasRefinedItemData(item)) {
                    buttons.unshift({
                        icon: "fas fa-skull",
                        label: t("dialog.refined-item-editor.button"),
                        class: "configure-refined-item",
                        onclick: () =>
                            configureRefinedItem(new RefinedItem(item)),
                    });
                }
            },
        );
    }

    static addNewRefinedItemButton() {
        Hooks.on(
            "renderDialogV2",
            (dialog: foundry.applications.api.DialogV2, html: HTMLElement) => {
                if (
                    !(
                        dialog.options.classes.includes("item-create") ||
                        dialog.options.classes.includes("dialog-item-create")
                    )
                )
                    return;
                const selector = html.querySelector("select")!;
                const refinedItemOption = createElement("option", {
                    attributes: { value: "refined-item" },
                    innerHTML: t("refined-item.label"),
                });
                const optgroup = createElement("optgroup", {
                    attributes: {
                        label: t("monster-parts") as string,
                    },
                    children: [refinedItemOption],
                });
                selector.appendChild(optgroup);
                // @ts-expect-error
                const callback = dialog.options.buttons.ok.callback;
                // @ts-expect-error
                dialog.options.buttons.ok.callback = (
                    event: SubmitEvent,
                    button: HTMLButtonElement,
                ) => {
                    const value = selector.value;
                    if (value == "refined-item") {
                        dialog.close();
                        event.stopImmediatePropagation();
                        createRefinedItemDialog();
                    } else {
                        callback(event, button);
                    }
                };
            },
        );
    }

    static hideSellMonsterPartsButton() {
        Hooks.on(
            "renderCreatureSheetPF2e",
            (
                sheet: CreatureSheetPF2e<CreaturePF2e>,
                html: HTMLDivElement[],
                { editable }: { editable: boolean },
            ) => {
                if (!editable) return;
                const actor = sheet.actor;
                const items = actor.items.filter(
                    (e) =>
                        e.isOfType("physical") &&
                        MonsterPart.hasMonsterPartData(e),
                );
                items.forEach((i) => {
                    const e = html[0].querySelector(
                        `[data-item-id='${i.id}'] a.item-sell-treasure`,
                    ) as HTMLAnchorElement | undefined;
                    if (e) e.style.display = "none";
                });
            },
        );
    }

    static registerEndCombatDialog() {
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
}
