import { tkey } from "../../utils";
import { ImbueSource } from "../data-types";
import { levelRange } from "../helpers";

export function createImbueSensory(): ImbueSource {
    const senses = [
        "darkvision",
        "truesight",
        "scent",
        "tremorsense",
        "echolocation",
        "greater-darkvision",
        "infrared-vision",
        "motion-sense",
        "see-invisibility",
        "wavesense",
    ].map((s) => `sense:${s}`);
    return {
        key: "imbue:sensory",
        type: "imbue",
        label: tkey("imbue.sensory.label"),
        flavor: tkey("imbue.sensory.flavor"),
        monsterPredicate: [{ or: senses }],
        itemPredicate: [
            {
                gte: [`refinement:perception`, 0],
            },
        ],
        effects: [
            {
                ...levelRange(6, 11),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.sensory.level-6"),
                    },
                ],
            },
            {
                ...levelRange(12, 15),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.sensory.level-12"),
                    },
                ],
            },
            {
                ...levelRange(16, 17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.sensory.level-16"),
                    },
                ],
            },
            {
                ...levelRange(18),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.sensory.level-18"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.sensory.level-20"),
                    },
                ],
            },
            {
                ...levelRange(4, 5),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.sensory.level-4"),
                    },
                ],
            },
            {
                ...levelRange(8, 11),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.sensory.level-8"),
                    },
                ],
            },
            {
                ...levelRange(14, 15),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.sensory.level-14"),
                    },
                ],
            },
        ],
    };
}
