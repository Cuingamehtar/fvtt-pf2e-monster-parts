import { SkillSlug } from "foundry-pf2e";
import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange } from "../helpers";

export function createImbueConstitution(): ImbueSource {
    const skills = Object.keys(CONFIG.PF2E.skills) as SkillSlug[];
    return {
        key: "imbue:constitution",
        type: "imbue",
        label: tkey("imbue.constitution.label"),
        flavor: tkey("imbue.constitution.flavor"),
        monsterPredicate: [{ lte: ["ability:con:rank", 2] }],
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
                        text: tkey("imbue.constitution.level-8"),
                    },
                ],
            },
            {
                ...levelRange(14, 17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.constitution.level-14"),
                    },
                ],
            },
            {
                ...levelRange(18),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.constitution.level-18"),
                    },
                ],
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.constitution.level-17"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.constitution.level-20"),
                    },
                ],
            },
        ],
    };
}
