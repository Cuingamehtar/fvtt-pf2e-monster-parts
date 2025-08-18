import { tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { levelRange, skillsOfAttribute } from "../../helpers";

export function createImbueStrength(): ImbueSource {
    const skills = skillsOfAttribute("str");
    return {
        key: "imbue:strength",
        type: "imbue",
        label: tkey("imbue.strength.label"),
        flavor: tkey("imbue.strength.flavor"),
        monsterPredicate: [{ lte: ["ability:str:rank", 2] }],
        itemPredicate: [
            {
                or: skills.map((s) => ({
                    gte: [`refinement:skill:${s}`, 0],
                })),
            },
        ],
        effects: [
            {
                ...levelRange(8, 13),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.strength.level-8"),
                    },
                ],
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.strength.level-14"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.strength.level-20"),
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.strength.level-17"),
                    },
                ],
            },
        ],
    };
}
