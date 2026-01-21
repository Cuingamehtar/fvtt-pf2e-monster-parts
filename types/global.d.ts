import i18nKeys from "../lang/en.json";

declare global {
    type Flatten<T> = {
        [K in keyof T as T[K] extends object
            ? K extends string
                ? `${K}.${keyof Flatten<T[K]>}`
                : never
            : K]: T[K] extends object
            ? Flatten<T[K]>[keyof Flatten<T[K]>]
            : T[K];
    };
    type Nested<T, K> = K extends `${infer Pre}.${infer Post}`
        ? Pre extends keyof T
            ? Nested<T[Pre], Post>
            : never
        : K extends keyof T
          ? T[K]
          : never;

    type Join<H extends string, T extends string> = `${H}.${T}`;
    type I18nLocalizableKey = {
        type: "key";
        key: I18nKey;
        parameters?: { [key: string]: I18nEntry };
    };
    type ResolvableParameter = {
        type: "resolve";
        value: I18nString | I18nLocalizableKey;
    };
    type I18nEntry =
        | I18nString
        | I18nLocalizableKey
        | ResolvableParameter
        | number;

    type I18nKeyType = typeof i18nKeys;
    /** String that is passed to `game.i18n.localize` */
    type I18nKey = keyof Flatten<I18nKeyType>;

    /** String that is used as material identifier */
    class MaterialKey {}

    /** String that is the result of `game.i18n.localize` */
    class I18nString {
        localeCompare(other: I18nString): number;
    }

    interface Notifications {
        warn(message: I18nKey, options?: NotificationOptions): number;
    }

    // REs

    interface DamageDiceSource {
        name: I18nKey | I18nString;
    }

    interface RollNoteSource {
        title?: I18nKey | I18nString;
        text: I18nKey | I18nString;
    }

    interface AttributeBasedTraceData {
        base: number;
    }

    interface IterableIterator<T> {
        map<R>(f: (v: T) => R): IterableIterator<R>;
        flatMap<R>(f: (v: T) => R[]): IterableIterator<R>;
        flatMap<R>(f: (v: T) => IterableIterator<R>): IterableIterator<R>;
        filter(f: (v: T) => boolean): IterableIterator<T>;
    }
}

export class NormalizedValue {}

type MaterialValue = {
    key: MaterialKey;
    value: NormalizedValue;
};

export type RefinedItemFlags = {
    refinement: MaterialValue;
    imbues: MaterialValue[];
};

export type MonsterPartFlags = {
    value: NormalizedValue;
    materials: MaterialKey[];
    imageSrc?: string;
};

export type ModuleFlags = {
    ["monster-part"]?: MonsterPartFlags;
    ["refined-item"]?: RefinedItemFlags;
};

export type RollString =
    | number
    | `${number}`
    | `${number}d${number}`
    | `d${number}`;

export type ModuleManifestFlags = {
    homebrewFiles?: string[];
};
