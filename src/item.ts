import { ActorPF2e, ItemPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import {
    getExtendedItemRollOptions,
    setPotency,
    setResilient,
    setStriking
} from "./itemUtil";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { getMaterialLevel, RefinedItemFlags } from "./flags";
import { RefinementSource } from "./data/data-types";
import { Material } from "./material";

export function optionChoiceDialog(
    options: RefinementSource[]
): Promise<RefinementSource | undefined> {
    if (options.length === 1) return Promise.resolve(options[0]);
    return new Promise((resolve) => {
        const select = foundry.applications.fields.createSelectInput({
            options: options.map((o) => ({
                label: game.i18n.localize(o.label),
                value: o.key
            })),
            name: "selectRefinement"
        });
        new foundry.applications.api.DialogV2({
            window: { title: "Choose an option" },
            content: select.outerHTML,
            buttons: [
                {
                    action: "select",
                    label: "Select",
                    default: true,
                    callback: (_event, button, _dialog) =>
                        // @ts-expect-error "elements don't have property in their type"
                        button.form?.elements.selectRefinement.value
                }
            ],
            submit: async (result) => {
                resolve(options.find((o) => o.key === result));
            }
        }).render({ force: true });
    });
}

export async function createRefinedItem(actor: ActorPF2e, uuid: ItemUUID) {
    const config = getConfig();

    const item = (await fromUuid(uuid)) as PhysicalItemPF2e;
    if (!item) {
        ui.notifications.error(`Invalid item UUID: ${uuid}`);
        return null;
    }
    const rollOptions = getExtendedItemRollOptions(item as ItemPF2e);
    const applicableRefinements = [
        ...config.materials
            .values()
            .filter((m) => m.type === "refinement")
            .filter((m) => new Material(m).testItem({ rollOptions }))
    ];
    if (!applicableRefinements) {
        ui.notifications.error(`No applicable refinements`);
        return null;
    }
    const refinement = await optionChoiceDialog(applicableRefinements);
    if (!refinement) return null;
    const flags: RefinedItemFlags = {
        refinement: {
            key: refinement.key,
            value: -item.system.price.value.goldValue
        },
        imbues: []
    };
    const data = item?.toObject();

    foundry.utils.mergeObject(
        data,
        {
            flags: { [MODULE_ID]: { refinedItem: flags } },
            system: {
                description: {
                    value: "@MPdata<hr>" + data.system.description.value
                }
            }
        },
        { inplace: true }
    );

    ChatMessage.create({
        content: `Item ${data.name} with refinement ${game.i18n.localize(refinement.label)} was created`
    });

    return actor.createEmbeddedDocuments("Item", [data]);
}

Hooks.on("renderItemSheetPF2e", (sheet, htmlArray, _) => {
    const html = htmlArray[0] as HTMLDivElement;
    const div = html.querySelector("div.monster-parts-header");
    if (!div) return;
    const item = sheet.item as ItemPF2e;
    const flags = item.getFlag(MODULE_ID, "refinedItem");
    if (!flags) return;
    const config = getConfig();
    const refinement = flags.refinement;
    const material = config.materials.get(refinement.key)!;
    let content = `<p>${game.i18n.localize(material.label)} <strong>${getMaterialLevel(refinement, item)} (${Math.floor(refinement.value)} gp)</strong></p>`;
    div.innerHTML = content;
});

export function getEffects(item: ItemPF2e) {
    const config = getConfig();
    const flags = item.getFlag(MODULE_ID, "refinedItem");
    if (!flags) return [];
    return [flags.refinement, ...flags.imbues].map((m) => {
        const material = config.materials.get(m.key);
        if (!material) return null;
        const level = getMaterialLevel(m, item);
        return {
            label: material.label,
            level,
            value: m.value,
            effects: material.effects
                .filter(
                    (e) =>
                        e.levels.from <= level &&
                        (!e.levels.to || level <= e.levels.to)
                )
                .flatMap((e) => e.effects)
        };
    });
}

export async function prepareRefinedItem(item: ItemPF2e) {
    const effects = getEffects(item);
    const rules = [];

    let updatedData = {};
    for (const effect of effects.flatMap((e) => e?.effects ?? [])) {
        switch (effect.key) {
            case "ItemPotency":
                foundry.utils.mergeObject(
                    updatedData,
                    setPotency(effect.value),
                    {
                        inplace: true
                    }
                );
                break;
            case "WeaponStriking":
                foundry.utils.mergeObject(
                    updatedData,
                    setStriking(effect.value),
                    {
                        inplace: true
                    }
                );
                break;
            case "ArmorResilient":
                foundry.utils.mergeObject(
                    updatedData,
                    setResilient(effect.value),
                    {
                        inplace: true
                    }
                );
                break;
            case "ShieldImprovement":
                let hardness = effect.hardness;
                let hp = effect.hp;
                const isBuckler =
                    (item as PhysicalItemPF2e).system.baseItem === "buckler";
                if (isBuckler) {
                    hardness -= 2;
                    hp -= 12;
                }
                return [
                    {
                        key: "ItemAlteration",
                        property: "hp-max",
                        mode: "upgrade",
                        value: hp,
                        itemId: "{item|id}"
                    },
                    {
                        key: "ItemAlteration",
                        property: "hardness",
                        mode: "upgrade",
                        value: hardness,
                        itemId: "{item|id}"
                    }
                ];
                break;
            case "SkillModifier":
                rules.push({
                    key: "FlatModifier",
                    selector: effect.skill,
                    type: "item",
                    value: effect.value
                });
                break;
            case "RuleElement":
                rules.push(effect.rule);
                break;
        }
    }
    foundry.utils.mergeObject(updatedData, { "system.rules": rules });
    return item.update(updatedData);
}
