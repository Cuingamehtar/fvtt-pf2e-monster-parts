import { MODULE_ID } from "../../module";
import { getRandomInt, t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { addWildDamage, levelRange } from "../helpers";

export function createImbueWild(): ImbueSource {
    const imbue: ImbueSource = {
        key: "imbue:wild:might",
        type: "imbue",
        label: t("imbue.wild.label", { variant: t("imbue.variant.might") }),
        flavor: tkey("imbue.wild.flavor"),
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
                    t("imbue.wild.label", {
                        variant: t("imbue.variant.might"),
                    }),
                ),
            },
            {
                ...levelRange(6, 7),
                effects: addWildDamage(
                    "1d4",
                    t("imbue.wild.label", {
                        variant: t("imbue.variant.might"),
                    }),
                ),
            },
            {
                ...levelRange(8, 17),
                effects: addWildDamage(
                    "1d6",
                    t("imbue.wild.label", {
                        variant: t("imbue.variant.might"),
                    }),
                ),
            },
            {
                ...levelRange(18),
                effects: addWildDamage(
                    "1d8",
                    t("imbue.wild.label", {
                        variant: t("imbue.variant.might"),
                    }),
                ),
            },
            {
                ...levelRange(12),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.wild.might.level-12"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.wild.might.level-20"),
                    },
                ],
            },
        ],
    };

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
