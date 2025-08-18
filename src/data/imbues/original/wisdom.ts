import { tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { levelRange, skillsOfAttribute } from "../../helpers";

export function createImbueWisdom(): ImbueSource {
    const skills = skillsOfAttribute("wis");
    return {
        key: "imbue:wisdom",
        type: "imbue",
        label: tkey("imbue.wisdom.label"),
        flavor: tkey("imbue.wisdom.flavor"),
        monsterPredicate: [{ lte: ["ability:wis:rank", 2] }],
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
                        text: tkey("imbue.wisdom.level-8"),
                    },
                ],
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.wisdom.level-14"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.wisdom.level-20"),
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.wisdom.level-17"),
                    },
                ],
            },
        ],
    };
}
