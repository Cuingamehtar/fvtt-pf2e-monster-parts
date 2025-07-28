import { t, tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange } from "../helpers";

export function createImbueWinged(): ImbueSource {
    return {
        key: "imbue:winged",
        type: "imbue",
        label: t("Imbue.Winged.Label"),
        itemPredicate: ["item:type:armor"],
        monsterPredicate: ["self:speed:fly"],
        effects: [
            {
                ...levelRange(6, 7),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Winged.Level6"),
                    },
                ],
            },
            {
                ...levelRange(8),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Winged.Level8"),
                    },
                ],
            },
            {
                ...levelRange(10, 13),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Winged.Level10"),
                    },
                ],
            },
            {
                ...levelRange(14, 17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Winged.Level14"),
                    },
                ],
            },
            {
                ...levelRange(16, 17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Winged.Level16"),
                    },
                ],
            },
            {
                ...levelRange(18),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Winged.Level18"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("Imbue.Winged.Level20"),
                    },
                ],
            },
        ],
    };
}
