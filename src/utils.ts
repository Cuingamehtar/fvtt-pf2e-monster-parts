// @ts-ignore
import type { GamePF2e } from "foundry-pf2e";
import {MODULE_ID} from "./module"

export function t(m:string, data?:{[key:string]:string | number | boolean | null}) {
    return data ? game.i18n.format(`${MODULE_ID}.${m}`, data) : game.i18n.localize(`${MODULE_ID}.${m}`);
}
export function tkey(s:string){
    return `${MODULE_ID}.${s}`
}

export function returns<T>(value:T) {
    return (_:T) => value;
}

export function getPartyActors() {
    return game.actors.party?.members ?? [];
}

export function any<T>(...predicates:((_: T) => boolean)[]) {
    return (item:T) => predicates.some(p => p(item));
}

export function all<T>(...predicates:((_: T) => boolean)[]) {
    return (item:T) => predicates.every(p => p(item));
}

export function forEach<T>(...functions:((_: T) => undefined)[]) {
    return (item:T) => functions.forEach(f => f(item));
}

export function unique<T>(array:T[]) {
    return Array.from(new Set(array));
}