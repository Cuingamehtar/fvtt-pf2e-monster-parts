import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange } from "../helpers";

export function createImbueDexterity(): ImbueSource {
    return {
        key: "imbue:dexterity",
        type: "imbue",
        label: tkey("Imbue.Charisma.Label"),
        monsterPredicate: [{ lte: ["ability:dex:rank", 2] }],
        itemPredicate: [{ or: ["refinement:skill:acrobatics", "refinement:skill:stealth", "refinement:skill:thievery"] }],
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