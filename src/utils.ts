import { MODULE_ID } from "./module";

export function t(
    m: string,
    data?: { [key: string]: string | number | boolean | null },
) {
    return i18nFormat(`${MODULE_ID}.${m}`, data);
}

export function i18nFormat(
    m: string,
    data?: { [key: string]: string | number | boolean | null | undefined },
) {
    let s = game.i18n.localize(m);
    if (!data) return s;
    for (const k in data) {
        const f = `{${k}}`;
        const v = String(data[k]);
        s = s.replaceAll(f, v);
    }
    return s;
}
export function tkey(s: string) {
    return `${MODULE_ID}.${s}`;
}

export function getPartyActors() {
    return game.actors.party?.members ?? [];
}

export function unique<T>(array: T[]) {
    return Array.from(new Set(array));
}

export function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}