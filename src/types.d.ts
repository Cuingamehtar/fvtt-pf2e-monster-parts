import { MODULE_ID } from "./module";
import i18nKeys from "../lang/en.json";
import { MonsterPartsConfig } from "./config";

declare global {
    type FromDataModel<T> =
        T extends foundry.data.fields.StringField<
            infer _A,
            infer _B,
            infer _C,
            infer _D,
            infer _E
        >
            ? FromStringModel<T>
            : T extends foundry.data.fields.NumberField<
                    infer _A,
                    infer _B,
                    infer _C,
                    infer _D,
                    infer _E
                >
              ? FromNumberModel<T>
              : T extends foundry.data.fields.SchemaField
                ? FromSchemaModel<T>
                : never;

    type FromSchemaModel<T> =
        T extends foundry.data.fields.SchemaField<
            infer TType,
            infer _TSourceProp,
            infer _TModelProp,
            infer TRequired,
            infer TNullable,
            infer THasInitial
        >
            ? ResolveNullable<
                  ResolveRequired<
                      { [TKey in keyof TType]: FromDataModel<TType[TKey]> },
                      TRequired,
                      THasInitial
                  >,
                  TNullable
              >
            : never;
    type FromNumberModel<T> =
        T extends foundry.data.fields.NumberField<
            infer TType,
            infer _B,
            infer TRequired,
            infer TNullable,
            infer THasInitial
        >
            ? ResolveNullable<
                  ResolveRequired<TType, TRequired, THasInitial>,
                  TNullable
              >
            : never;
    type FromStringModel<T> =
        T extends foundry.data.fields.StringField<
            infer TType,
            infer _B,
            infer TRequired,
            infer TNullable,
            infer THasInitial
        >
            ? ResolveNullable<
                  ResolveRequired<TType, TRequired, THasInitial>,
                  TNullable
              >
            : never;
    type ResolveRequired<
        TProp,
        TRequired extends boolean,
        THasInitial extends boolean,
    > = TRequired extends true
        ? TProp
        : THasInitial extends true
          ? TProp
          : TProp | undefined;
    type ResolveNullable<
        TProp,
        TNullable extends boolean,
    > = TNullable extends false ? TProp : TProp | null;

    type Flatten<T> = {
        [K in keyof T as T[K] extends object
            ? K extends string
                ? `${K}.${keyof Flatten<T[K]>}`
                : never
            : K]: T[K] extends object
            ? Flatten<T[K]>[keyof Flatten<T[K]>]
            : T[K];
    };

    type I18nKeyType = typeof i18nKeys;
    /** String that is passed to `game.i18n.localize` */
    type I18nKey = keyof Flatten<I18nKeyType>;

    /** String that is used as material identifier */
    class MaterialKey {}

    /** String that is the result of `game.i18n.localize` */
    class I18nString {
        localeCompare(other: I18nString): number;
    }

    interface ClientSettingsPF2e {
        get(m: typeof MODULE_ID, key: "actor-lootable"): boolean;
        get(
            m: typeof MODULE_ID,
            key: "armor-refinements",
        ): "none" | "ask" | "all";
        get(m: typeof MODULE_ID, key: "variant"): "light" | "hybrid" | "full";
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

    // config
    interface ConfigPF2e {
        [MODULE_ID]: MonsterPartsConfig;
    }

    interface AttributeBasedTraceData {
        base: number;
    }
}
type MaterialValue = {
    key: MaterialKey;
    value: number;
};

export type RefinedItemFlags = {
    refinement: MaterialValue;
    imbues: MaterialValue[];
};

export type MonsterPartFlags = {
    value: number;
    materials: MaterialKey[];
};

export type ModuleFlags = {
    ["monster-part"]?: MonsterPartFlags;
    ["refined-item"]?: RefinedItemFlags;
    text?: string;
};

declare module "foundry-pf2e" {
    interface ItemPF2e {
        getFlag(
            scope: "pf2e-monster-parts",
            key: "monster-part",
        ): ModuleFlags["monster-part"];
        getFlag(
            scope: "pf2e-monster-parts",
            key: "refined-item",
        ): ModuleFlags["refined-item"];
    }
}
