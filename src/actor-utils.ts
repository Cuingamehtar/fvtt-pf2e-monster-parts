import type { NPCPF2e } from "foundry-pf2e";
import { unique } from "./utils";

export function getExtendedNPCRollOptions(actor: NPCPF2e): string[] {
    const baseRollOptions = actor.getRollOptions();
    const senses = Object.keys(CONFIG.PF2E.senses)
        .filter((s) =>
            actor.system.perception.senses.some((sense) => sense.type === s),
        )
        .map((s) => `sense:${s}`);
    const skills = Object.values(actor.system.skills)
        .filter((s) => s.base > 0)
        .map((s) => `skill:${s.slug}:rank:1`);
    const resistances = actor.attributes.resistances.map(
        (r) => `self:resistance:${r.type}:${r.value}`,
    );
    const immunities = actor.attributes.immunities.map(
        (i) => `self:immunity:${i.type}`,
    );

    const abilityRanks = getAbilityRanks(actor);

    return [
        ...baseRollOptions,
        ...senses,
        ...skills,
        `self:hardness:${actor.hardness}`,
        ...resistances,
        ...immunities,
        ...abilityRanks,
    ];
}

function getAbilityRanks(actor: NPCPF2e) {
    const abilities = actor.system.abilities;
    if (!abilities) return [];
    const values = unique(Object.values(abilities).map((a) => a.mod)).sort(
        (a, b) => b - a,
    );
    return Object.entries(abilities).map(
        ([k, v]) => `ability:${k}:rank:${values.indexOf(v.mod) + 1}`,
    );
}
