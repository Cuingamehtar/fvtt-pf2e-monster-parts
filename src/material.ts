import { CreaturePF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { t } from "./utils";
import { MonsterPartFlags } from "./flags";
import { getExtendedItemRollOptions, getExtendedNPCRollOptions } from "./itemUtil";

export function createMaterial(actor: CreaturePF2e) {
    const config = getConfig();

    const bulk = config.materialBulk[actor.system.traits.size.value];
    const materialValue = config.valueForMonsterLevel[actor.system.details.level.value + 1];
    const name = t("Material.Item.Name", { actor: actor.name, value: materialValue });

    const Predicate = game.pf2e.Predicate;
    const actorRollOptions = getExtendedNPCRollOptions(actor);
    const rollOptions = [actorRollOptions, ...actor.items.map(i => [...actorRollOptions, ...getExtendedItemRollOptions(i)])];

    const materials = config.materials.filter(m => {
        const p = new Predicate(m.monsterPredicate ?? []);
        return rollOptions.some(ro => p.test(ro));
    });
    const flags: MonsterPartFlags = { value: materialValue, materials:materials.map(m=>m.key) };


    const item = {
        name,
        img: config.materialItem.image,
        system: { bulk: { value: bulk }, description: { value: materials.map(m=>`<p>${game.i18n.localize(m.label)}</p>`).join("") } },
        type: "equipment",
        flags: { [MODULE_ID]: flags }
    }
    // @ts-ignore
    return actor.createEmbeddedDocuments("Item", [item])
}