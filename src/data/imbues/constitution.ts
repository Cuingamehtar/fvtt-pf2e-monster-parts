import { SkillSlug } from "foundry-pf2e";
import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange } from "../helpers";

export function createImbueConstitution(): ImbueSource {
    const skills = Object.keys(CONFIG.PF2E.skills) as SkillSlug[];
    return {
        key: "imbue:constitution",
        type: "imbue",
        label: tkey("Imbue.Constitution.Label"),
        monsterPredicate: [{ lte: ["ability:con:rank", 2] }],
        itemPredicate: [{ or: skills.map(s=>`refinement:skill:${s}`) }],
        effects: [
            {
                ...levelRange(8, 13),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Constitution.Level8")
                    }
                ]
            },
            {
                ...levelRange(14, 17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Constitution.Level14")
                    }
                ]
            },
            {
                ...levelRange(18),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Constitution.Level18")
                    }
                ]
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Constitution.Level17")
                    }
                ]
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Constitution.Level20")
                    }
                ]
            }
        ]
    }
}