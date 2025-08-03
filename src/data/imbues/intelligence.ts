import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange, skillsOfAttribute } from "../helpers";

export function createImbueIntelligence(): ImbueSource {
    const skills = skillsOfAttribute("int");
    return {
        key: "imbue:intelligence",
        type: "imbue",
        label: tkey("Imbue.Intelligence.Label"),
        flavor: tkey("Imbue.Intelligence.Flavor"),
        monsterPredicate: [{ lte: ["ability:int:rank", 2] }],
        itemPredicate: [{ or: skills.map((s) => `refinement:skill:${s}`) }],
        effects: [
            {
                ...levelRange(8, 13),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Intelligence.Level8"),
                    },
                ],
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Intelligence.Level14"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Intelligence.Level20"),
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Intelligence.Level17"),
                    },
                ],
            },
        ],
    };
}
