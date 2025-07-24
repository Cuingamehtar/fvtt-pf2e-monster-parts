import { MODULE_ID } from "../../module";
import { getRandomInt, t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addWildDamage, levelRange } from "../helpers";

export function createImbueWild(): ImbueSource {
    const imbue: ImbueSource = {
        key: "imbue:wild:might",
        type: "imbue",
        label: t("Imbue.Wild.Label", { variant: t("Imbue.Variant.Might") }),
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [],
        effects: [
            {
                ...levelRange(4),
                effects: [
                    {
                        key: "RuleElement",
                        rule: {
                            key: "RollOption",
                            option: "item:imbue:wild:6",
                            domain: "{item|_id}-damage",
                        },
                    },
                ],
            },
            {
                ...levelRange(4, 5),
                effects: addWildDamage(
                    1,
                    t("Imbue.Wild.Label", {
                        variant: t("Imbue.Variant.Might"),
                    }),
                ),
            },
            {
                ...levelRange(6, 7),
                effects: addWildDamage(
                    "1d4",
                    t("Imbue.Wild.Label", {
                        variant: t("Imbue.Variant.Might"),
                    }),
                ),
            },
            {
                ...levelRange(8, 17),
                effects: addWildDamage(
                    "1d6",
                    t("Imbue.Wild.Label", {
                        variant: t("Imbue.Variant.Might"),
                    }),
                ),
            },
            {
                ...levelRange(18),
                effects: addWildDamage(
                    "1d8",
                    t("Imbue.Wild.Label", {
                        variant: t("Imbue.Variant.Might"),
                    }),
                ),
            },
            {
                ...levelRange(12),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Wild.Might.Level12"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Wild.Might.Level20"),
                    },
                ],
            },
            {
                ...levelRange(8, 11),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Fire.Magic.Level8"),
                    },
                ],
            },
            {
                ...levelRange(12, 15),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Fire.Magic.Level12"),
                    },
                ],
            },
            {
                ...levelRange(16),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Fire.Magic.Level16"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Fire.Magic.Level20"),
                    },
                ],
            },
        ],
    };

    // @ts-expect-error
    libWrapper.register(
        MODULE_ID,
        "CONFIG.PF2E.Actor.documentClasses.character.prototype.getRollOptions",
        // @ts-ignore
        (wrapped, ...args) => {
            let res: string[] = wrapped(...args);
            if (
                args[0]?.includes("strike-damage") &&
                res.some((o) => o.includes("imbue:wild"))
            ) {
                let r = getRandomInt(6) + 1;
                res.push(`wild:damage-type:${r}`);
            }
            return res;
        },
        "MIXED",
    );

    return imbue;
}
