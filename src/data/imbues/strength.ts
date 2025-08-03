import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange, skillsOfAttribute } from "../helpers";

export function createImbueStrength(): ImbueSource {
    const skills = skillsOfAttribute("str");
    return {
        key: "imbue:strength",
        type: "imbue",
        label: tkey("Imbue.Strength.Label"),
        flavor: tkey("Imbue.Strength.Flavor"),
        monsterPredicate: [{ lte: ["ability:str:rank", 2] }],
        itemPredicate: [{ or: skills.map((s) => `refinement:skill:${s}`) }],
        effects: [
            {
                ...levelRange(8, 13),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Strength.Level8"),
                    },
                ],
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Strength.Level14"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Strength.Level20"),
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Strength.Level17"),
                    },
                ],
            },
        ],
    };
}
