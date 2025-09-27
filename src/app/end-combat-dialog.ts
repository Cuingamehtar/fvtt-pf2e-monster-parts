import { Hooks } from "foundry-pf2e/foundry/client/helpers/hooks";
import { CombatantPF2e } from "foundry-pf2e";

export function registerEndCombatDialog() {
    Hooks.on("deleteCombat", (combat: any) => {
        const combatant = combat.combatant as Record<string, CombatantPF2e>;
    });
}
