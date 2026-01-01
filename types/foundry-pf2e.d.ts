import { ModuleFlags, ModuleManifestFlags } from "./global";
import * as FoundryPF2e from "foundry-pf2e";
import { MODULE_ID } from "@src/module";
import { MonsterPartsConfig } from "@src/config";

type Currency = FoundryPF2e.CoinDenomination | "credits" | "upb";

declare module "foundry-pf2e" {
    export interface ItemPF2e {
        getFlag(
            scope: "pf2e-monster-parts",
            key: "monster-part",
        ): ModuleFlags["monster-part"];
        getFlag(
            scope: "pf2e-monster-parts",
            key: "refined-item",
        ): ModuleFlags["refined-item"];
    }
    export interface TreasurePF2e {
        get isCurrency(): boolean;
    }
    export interface ActorInventory<TActor extends FoundryPF2e.ActorPF2e> {
        addCurrency(
            coins: Partial<Record<Currency, number>>,
            options?: { combineStacks?: boolean },
        ): Promise<void>;
    }

    export interface ConfigPF2e {
        "pf2e-monster-parts": MonsterPartsConfig;
    }

    export interface ClientSettingsPF2e {
        get(m: typeof MODULE_ID, key: "actor-lootable"): boolean;
        get(
            m: typeof MODULE_ID,
            key: "armor-refinements",
        ): "none" | "ask" | "all";
        get(m: typeof MODULE_ID, key: "variant"): "light" | "hybrid" | "full";
        get(
            m: typeof MODULE_ID,
            key: "baneTraits",
        ): (keyof typeof CONFIG.PF2E.creatureTraits)[];
        get(m: typeof MODULE_ID, key: "homebrew-folder"): string | undefined;
    }

    export interface GamePF2e {
        get world(): {
            id: string;
            name: string;
            flags?: { [MODULE_ID]: ModuleManifestFlags };
        };
    }
}
