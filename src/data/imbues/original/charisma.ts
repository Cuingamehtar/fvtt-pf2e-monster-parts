import { tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { levelRange, skillsOfAttribute } from "../../helpers";

export function createImbueCharisma(): ImbueSource {
    const skills = skillsOfAttribute("cha");
    return {
        key: "imbue:charisma",
        type: "imbue",
        label: tkey("imbue.charisma.label"),
        flavor: tkey("imbue.charisma.flavor"),
        monsterPredicate: [{ lte: ["ability:cha:rank", 2] }],
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
                        text: tkey("imbue.charisma.level-8"),
                    },
                ],
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.charisma.level-14"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.charisma.level-20"),
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.charisma.level-17"),
                    },
                ],
            },
        ],
    };
}
