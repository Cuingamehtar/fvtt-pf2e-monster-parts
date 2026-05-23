import * as R from "remeda";
import { getConfig } from "@src/config";
import { renderSummaryJournal } from "@src/summary-journal";
import { getExtendedNPCRollOptions } from "@src/actor-utils";
import { ActorPF2e } from "foundry-pf2e";
import { MonsterPart } from "@src/monster-part";

export class API {
    static updateEachMaterial(...rules: StrReplFunc[]) {
        const materials = getConfig().materials;
        for (const [key, value] of materials.entries()) {
            materials.set(key, recursiveReplace(value, rules));
        }
    }
    static updateMaterial(key: string, ...rules: StrReplFunc[]) {
        const materials = getConfig().materials;
        const m = materials.get(key);
        if (!m) {
            throw new Error(`Unknown material ${key}`);
        }
        materials.set(key, recursiveReplace(m, rules));
    }

    static renderSummaryJournal = renderSummaryJournal;
    static getExtendedNPCRollOptions = getExtendedNPCRollOptions;

    static addMonsterParts(actor: ActorPF2e) {
        if (!actor.isOfType("npc")) {
            throw new Error("Can't add monster parts to non-NPC creature");
        }
        return MonsterPart.fromCreature(actor);
    }
}

type StrReplFunc = (s: string, property?: string) => string;

function recursiveReplace<T>(source: T, replacements: StrReplFunc[]): T {
    return _recursiveReplace(source, [], replacements);
}
function _recursiveReplace<T>(
    source: T,
    path: string[],
    replacements: StrReplFunc[],
): T;
function _recursiveReplace(
    source: unknown,
    path: string[],
    replacements: StrReplFunc[],
): unknown {
    const clone =
        Array.isArray(source) || R.isPlainObject(source)
            ? foundry.utils.deepClone(source)
            : source;
    if (typeof clone === "string") {
        return replacements.reduce(
            (acc, f) => f(acc, path.join(".")),
            clone as string,
        );
    } else if (Array.isArray(clone)) {
        return clone.map((e, i) =>
            _recursiveReplace(e, [...path, String(i)], replacements),
        );
    } else if (R.isPlainObject(clone)) {
        for (const [key, value] of Object.entries(clone)) {
            clone[key] = _recursiveReplace(value, [...path, key], replacements);
        }
    }

    return clone;
}
