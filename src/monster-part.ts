import { NPCPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getConfig } from "./config";
import { t } from "./utils";
import { MonsterPartFlags } from "./flags";
import {
    getExtendedItemRollOptions,
    getExtendedNPCRollOptions,
} from "./itemUtil";
import { Material } from "./material";

export async function createMonsterPart(actor: NPCPF2e) {
    const config = getConfig();

    const bulk = config.materialBulk[actor.system.traits.size.value];
    const materialValue =
        config.valueForMonsterLevel[actor.system.details.level.value + 1];
    const name = t("Material.Item.Name", {
        actor: actor.name,
        value: materialValue,
    });

    const actorRollOptions = getExtendedNPCRollOptions(actor);
    const rollOptions = [
        actorRollOptions,
        ...actor.items.map((i) => [
            ...actorRollOptions,
            ...getExtendedItemRollOptions(i),
        ]),
    ];

    const materials = [
        ...config.materials.values().filter((m) => {
            const mat = new Material(m);
            return rollOptions.some((ro) =>
                mat.testCreature({ rollOptions: ro }),
            );
        }),
    ];
    const flags: MonsterPartFlags = {
        value: materialValue,
        materials: materials.map((m) => m.key),
    };

    const item = {
        name: name as string,
        img: config.materialItem.image,
        system: {
            bulk: { value: bulk },
            description: {
                value: materials
                    .map((m) => `<p>${game.i18n.localize(m.label)}</p>`)
                    .join(""),
            },
        },
        type: "equipment",
        flags: { [MODULE_ID]: { monsterPart: flags } },
    };
    if (game.settings.get(MODULE_ID, "actorLootable")) {
        await actor.setFlag("pf2e", "lootable", true);
    }

    return actor.createEmbeddedDocuments("Item", [item]);
}
