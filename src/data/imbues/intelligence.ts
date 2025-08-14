import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange, skillsOfAttribute } from "../helpers";

export function createImbueIntelligence(): ImbueSource {
    const skills = skillsOfAttribute("int");
    return {
        key: "imbue:intelligence",
        type: "imbue",
        label: tkey("imbue.intelligence.label"),
        flavor: tkey("imbue.intelligence.flavor"),
        monsterPredicate: [{ lte: ["ability:int:rank", 2] }],
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
                        text: tkey("imbue.intelligence.level-8"),
                    },
                ],
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.intelligence.level-14"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.intelligence.level-20"),
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.intelligence.level-17"),
                    },
                ],
            },
        ],
    };
}
