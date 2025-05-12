import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange } from "../helpers";

export function createImbueCharisma(): ImbueSource {
    return {
        key: "imbue:charisma",
        type: "imbue",
        label: tkey("Imbue.Charisma.Label"),
        monsterPredicate: [{ lte: ["ability:cha:rank", 2] }],
        itemPredicate: [{ or: ["refinement:skill:deception", "refinement:skill:diplomacy", "refinement:skill:intimidation", "refinement:skill:performance"] }],
        effects: [
            {
                ...levelRange(8, 13),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Charisma.Level8")
                    }
                ]
            },
            {
                ...levelRange(14, 19),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Charisma.Level14")
                    }
                ]
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Charisma.Level20")
                    }
                ]
            },
            {
                ...levelRange(17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Charisma.Level17")
                    }
                ]
            }
        ]
    }
}