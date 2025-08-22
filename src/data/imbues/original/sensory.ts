import { tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { levelRange } from "../../helpers";

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
                    {
                        key: "RuleElement",
                        rule: {
                            key: "Sense",
                            selector: "low-light-vision",
                        },
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
                    {
                        key: "RuleElement",
                        rule: {
                            key: "Sense",
                            selector: "darkvision",
                        },
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
                    {
                        key: "RuleElement",
                        rule: {
                            key: "Sense",
                            selector: "darkvision",
                        },
                    },
                    {
                        key: "RuleElement",
                        rule: {
                            acuity: "imprecise",
                            key: "Sense",
                            range: 30,
                            selector: "scent",
                        },
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
                    {
                        key: "RuleElement",
                        rule: {
                            key: "Sense",
                            selector: "greater-darkvision",
                        },
                    },
                    {
                        key: "RuleElement",
                        rule: {
                            acuity: "imprecise",
                            key: "Sense",
                            range: 30,
                            selector: "scent",
                        },
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
                    {
                        key: "RuleElement",
                        rule: {
                            key: "RollOption",
                            domain: "all",
                            label: tkey(
                                "imbue.sensory.temporary-low-light-vision",
                            ),
                            option: "imbue:sensory:temporary-low-light-vision",
                            toggleable: true,
                        },
                    },
                    {
                        key: "RuleElement",
                        rule: {
                            key: "Sense",
                            selector: "low-light-vision",
                            predicate: [
                                "imbue:sensory:temporary-low-light-vision",
                            ],
                        },
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
                    {
                        key: "RuleElement",
                        rule: {
                            key: "RollOption",
                            domain: "all",
                            label: tkey("imbue.sensory.temporary-darkvision"),
                            option: "imbue:sensory:temporary-darkvision",
                            toggleable: true,
                        },
                    },
                    {
                        key: "RuleElement",
                        rule: {
                            key: "Sense",
                            selector: "darkvision",
                            predicate: ["imbue:sensory:temporary-darkvision"],
                        },
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
                    {
                        key: "RuleElement",
                        rule: {
                            key: "RollOption",
                            domain: "all",
                            label: tkey("imbue.sensory.temporary-scent"),
                            option: "imbue:sensory:temporary-scent",
                            toggleable: true,
                        },
                    },
                    {
                        key: "RuleElement",
                        rule: {
                            acuity: "imprecise",
                            key: "Sense",
                            range: 30,
                            predicate: ["imbue:sensory:temporary-scent"],
                            selector: "scent",
                        },
                    },
                ],
            },
        ],
    };
}
