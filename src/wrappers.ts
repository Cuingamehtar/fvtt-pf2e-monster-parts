import { ActorInventory, CharacterPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { MonsterPart } from "./monster-part";
import { getRandomInt, hash } from "./utils";
import { MODULE_ID } from "./module";
import { RefinedItem } from "./refined-item";
import { Material } from "./material";

export class Wrappers {
    static patchSellAllTreasure() {
        const actor = new CONFIG.PF2E.Actor.documentClasses.character({
            name: "test",
            type: "character",
        });
        //@ts-expect-error
        globalThis.__tempActor = actor;

        // literally copy the system function and add a custom check
        const systemFunctionHash = 595497346;
        if (
            hash(actor.inventory.sellAllTreasure.toString()) !==
            systemFunctionHash
        ) {
            ui.notifications.warn(
                "Sell all treasure function text mismatch. Patching might result in the unexpected behavior.",
            );
        }

        libWrapper.register(
            "pf2e-monster-parts",
            "__tempActor.inventory.__proto__.sellAllTreasure",
            async function (this: ActorInventory<CharacterPF2e>) {
                const treasures = this.actor.itemTypes.treasure.filter(
                    (item) =>
                        !item.isCoinage &&
                        !MonsterPart.hasMonsterPartData(item),
                );
                const treasureIds = treasures.map((item) => item.id);
                const coins = treasures
                    .map((item) => item.assetValue)
                    .reduce(
                        (first, second) => first.plus(second),
                        new game.pf2e.Coins(),
                    );
                await this.actor.deleteEmbeddedDocuments("Item", treasureIds);
                await this.actor.inventory.addCoins(coins);
            },
            "OVERRIDE",
        );
        //@ts-expect-error
        delete globalThis.__tempActor;
    }

    static registerWildImbuement() {
        libWrapper.register(
            MODULE_ID,
            "CONFIG.PF2E.Actor.documentClasses.character.prototype.getRollOptions",
            // @ts-ignore
            (wrapped, ...args) => {
                let res: string[] = wrapped(...args);
                if (
                    args[0]?.includes("strike-damage") &&
                    res.includes("item:imbue:wild")
                ) {
                    let r = getRandomInt(6) + 1;
                    res.push(`wild:damage-type:${r}`);
                }
                return res;
            },
            "MIXED",
        );
    }

    static registerInlineNotes(): void {
        async function addDescriptionNote(
            item: PhysicalItemPF2e,
            description: { value: string; gm: string },
        ) {
            if (MonsterPart.hasMonsterPartData(item)) {
                description.value =
                    (await new MonsterPart(item).descriptionHeader()) +
                    description.value;
            }
            if (RefinedItem.hasRefinedItemData(item)) {
                description.value =
                    (await new RefinedItem(item).descriptionHeader()) +
                    description.value;
            }
            return description;
        }

        libWrapper.register(
            MODULE_ID,
            "CONFIG.PF2E.Item.documentClasses.equipment.__proto__.prototype.getDescription",
            async function (
                this: PhysicalItemPF2e,
                wrapped: (options: any) => Promise<{
                    value: string;
                    gm: string;
                }>,
                args: any,
            ) {
                return addDescriptionNote(this, await wrapped(args));
            },
        );
    }

    static extendDerivedData() {
        libWrapper.register(
            MODULE_ID,
            "CONFIG.PF2E.Item.documentClasses.weapon.__proto__.prototype.prepareDerivedData",
            function (
                this: PhysicalItemPF2e,
                wrapped: typeof PhysicalItemPF2e.prototype.prepareDerivedData,
            ) {
                wrapped();
                if (RefinedItem.hasRefinedItemData(this)) {
                    const item = new RefinedItem(this);
                    const flag = item.getFlag();
                    this.system.level.value =
                        Material.fromKey(
                            flag.refinement.key,
                            flag.refinement.value,
                        )?.getLevel(item) ?? 0;

                    this.system.price.value = item.coinValue;
                }
                if (MonsterPart.hasMonsterPartData(this)) {
                    const item = new MonsterPart(this);
                    this.system.price.value = item.coinValue;
                }
            },
            "MIXED",
        );
    }
}
