import type { NPCPF2e, ItemPF2e } from "foundry-pf2e";
import { MODULE_ID } from "./module";
import { getMaterialLevel, RefinedItemFlags } from "./flags";
import { unique } from "./utils";

export function setPotency(value: number) {
    return { "system.runes.potency": value };
}

export function setStriking(value: number) {
    return { "system.runes.striking": value };
}

export function setResilient(value: number) {
    return { "system.runes.resilient": value };
}

export function getExtendedItemRollOptions(item: ItemPF2e) {
    const options = [...item.getRollOptions(), `item:type:${item.type}`];
    const flags = item.getFlag(MODULE_ID, "refinedItem") as RefinedItemFlags;
    if (!flags) return options;
    return [
        ...options,
        ...[flags.refinement, ...flags.imbues].map(
            (v) => `${v.key}:${getMaterialLevel(v, item)}`,
        ),
    ];
}

export function getExtendedNPCRollOptions(actor: NPCPF2e): string[] {
    const baseRollOptions = actor.getRollOptions();
    const senses = [
        "darkvision",
        "truesight",
        "scent",
        "tremorsense",
        "echolocation",
        "greater-darkvision",
        "infrared-vision",
        "motion-sense",
        "see-invisibility",
        "wavesense",
    ]
        .filter((s) =>
            actor.system.perception.senses.some((sense) => sense.type === s),
        )
        .map((s) => `sense:${s}`);
    const skills = Object.values(actor.system.skills)
        .filter((s) => s.base > 0)
        .map((s) => `skill:${s.slug}:rank:1`);
    const resistances = actor.system.attributes.resistances
        .filter((r) =>
            ["physical", "bludgeoning", "piercing", "slashing"].includes(
                r.type,
            ),
        )
        .map((r) => `self:resistance:${r.type}:${r.value}`);

    const abilityRanks = getAbilityRanks(actor);

    return [
        ...baseRollOptions,
        ...senses,
        ...skills,
        `self:hardness:${actor.hardness}`,
        ...resistances,
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

declare module "foundry-pf2e" {
    interface AttributeBasedTraceData {
        base: number;
    }
}
