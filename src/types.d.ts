import { MODULE_ID } from "./module";
import i18nKeys from "../lang/en.json";
import { MonsterPartsConfig } from "./config";

declare global {
    type Flatten<T> = {
        [K in keyof T as T[K] extends object ? K extends string ? `${K}.${keyof Flatten<T[K]>}` : never : K]: T[K] extends object ? Flatten<T[K]>[keyof Flatten<T[K]>] : T[K];
    };

    type I18nKeyType = typeof i18nKeys;
    type I18nKey = keyof Flatten<I18nKeyType>;

    class I18nString {
        localeCompare(other: I18nString): number;
    }

    interface ClientSettings {
        get(m: typeof MODULE_ID, key: "actorLootable"): boolean;

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
        title?: I18nKey | I18nString,
        text: I18nKey | I18nString
    }

    // config
    interface ConfigPF2e {
        [MODULE_ID]: MonsterPartsConfig
    }

    interface AttributeBasedTraceData {
        base: number;
    }
}