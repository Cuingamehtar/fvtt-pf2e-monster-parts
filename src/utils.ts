import { MODULE_ID } from "./module";

export function t(
    m: keyof Flatten<I18nKeyType[typeof MODULE_ID]>,
    data?: { [key: string]: string | number | boolean | null | I18nString },
) {
    return i18nFormat(`${MODULE_ID}.${m}`, data);
}

export function i18nFormat(
    m: I18nKey | I18nString,
    data?: {
        [key: string]:
            | string
            | number
            | boolean
            | null
            | undefined
            | I18nString;
    },
) {
    let s = game.i18n.localize(m as string);
    if (!data) return s as I18nString;
    for (const k in data) {
        const f = `{${k}}`;
        const v = String(data[k]);
        s = s.replaceAll(f, v);
    }
    return s as I18nString;
}

export function tkey(s: keyof Flatten<I18nKeyType[typeof MODULE_ID]>): I18nKey {
    return `${MODULE_ID}.${s}`;
}

export function getPartyActors() {
    return game.actors.party?.members ?? [];
}

export function unique<T>(array: T[]) {
    return Array.from(new Set(array));
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function createElement(
    type: string,
    {
        attributes,
        children,
        classes,
        innerHTML,
    }: {
        classes?: string[];
        attributes?: { [key: string]: string };
        children?: HTMLElement[];
        innerHTML?: I18nString;
    },
) {
    const element = document.createElement(type);
    if (classes) {
        element.classList.add(...classes);
    }
    if (attributes) {
        for (const k in attributes) {
            element.setAttribute(k, attributes[k]);
        }
    }
    if (children) {
        for (const child of children) {
            element.appendChild(child);
        }
    }
    if (innerHTML) {
        element.innerHTML = innerHTML as string;
    }
    return element;
}
