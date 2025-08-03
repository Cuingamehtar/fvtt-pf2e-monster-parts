import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange, skillsOfAttribute } from "../helpers";

export function createImbueWisdom(): ImbueSource {
    const skills = skillsOfAttribute("wis");
    return {
        key: "imbue:wisdom",
        type: "imbue",
        label: tkey("Imbue.Wisdom.Label"),
        flavor: tkey("Imbue.Wisdom.Flavor"),
        monsterPredicate: [{ lte: ["ability:wis:rank", 2] }],
        itemPredicate: [{ or: skills.map((s) => `refinement:skill:${s}`) }],
        effects: [
            {
                ...levelRange(8, 13),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Wisdom.Level8"),
                    },
                ],
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Wisdom.Level14"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Wisdom.Level20"),
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Wisdom.Level17"),
                    },
                ],
            },
        ],
    };
}
