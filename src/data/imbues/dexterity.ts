import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange, skillsOfAttribute } from "../helpers";

export function createImbueDexterity(): ImbueSource {
    const skills = skillsOfAttribute("dex");
    return {
        key: "imbue:dexterity",
        type: "imbue",
        label: tkey("Imbue.Charisma.Label"),
        monsterPredicate: [{ lte: ["ability:dex:rank", 2] }],
        itemPredicate: [{ or: skills.map(s=>`refinement:skill:${s}`) }],
        effects: [
            {
                ...levelRange(8, 13),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Dexterity.Level8")
                    }
                ]
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Dexterity.Level14")
                    }
                ]
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Dexterity.Level20")
                    }
                ]
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Dexterity.Level17")
                    }
                ]
            }
        ]
    }
}