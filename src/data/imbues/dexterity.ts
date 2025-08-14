import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange, skillsOfAttribute } from "../helpers";

export function createImbueDexterity(): ImbueSource {
    const skills = skillsOfAttribute("dex");
    return {
        key: "imbue:dexterity",
        type: "imbue",
        label: tkey("imbue.dexterity.label"),
        monsterPredicate: [{ lte: ["ability:dex:rank", 2] }],
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
                        text: tkey("imbue.dexterity.level-8"),
                    },
                ],
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.dexterity.level-14"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.dexterity.level-20"),
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.dexterity.level-17"),
                    },
                ],
            },
        ],
    };
}
