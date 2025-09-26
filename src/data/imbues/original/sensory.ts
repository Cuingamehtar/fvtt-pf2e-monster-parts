import { tkey } from "../../../utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";

export function createImbueSensory(): MaterialData {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.sensory"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.sensory.${k}`);

    // The actual requirements for sensory imbuement are complex to automate, so currently this material is satisfied by any special sense
    const senses = Object.keys(CONFIG.PF2E.senses).map((s) => `sense:${s}`);
    return {
        key: "imbue:sensory",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
        monsterPredicate: [{ or: senses }],
        itemPredicate: [
            {
                gte: [`refinement:perception`, 0],
            },
        ],
        header: {
            description: { type: "key", key: lkey("flavor") },
            labels: [
                ...helpers.leveledLabels(
                    [6, 12, 16, 18],
                    [
                        "level-6-permanent",
                        "level-12-permanent",
                        "level-16-permanent",
                        "level-18-permanent",
                    ],
                    (k: Parameters<typeof lkey>[0]) => ({
                        text: { type: "key", key: lkey(k) },
                        sort: 1,
                    }),
                ),
                ...helpers.leveledLabels(
                    [4, 8, 14],
                    [
                        "level-4-activation",
                        "level-8-activation",
                        "level-14-activation",
                    ],
                    (k: Parameters<typeof lkey>[0]) => ({
                        text: { type: "key", key: lkey(k) },
                        sort: 2,
                    }),
                ),
                {
                    levelMin: 20,
                    text: { type: "key", key: lkey("level-20-truesight") },
                    sort: 3,
                },
            ],
        },
        effects: [
            {
                levelMin: 6,
                levelMax: 11,
                type: "RuleElement",
                rule: {
                    key: "Sense",
                    selector: "low-light-vision",
                },
            },
            {
                levelMin: 12,
                levelMax: 17,
                type: "RuleElement",
                rule: {
                    key: "Sense",
                    selector: "darkvision",
                },
            },
            {
                levelMin: 16,
                type: "RuleElement",
                rule: {
                    acuity: "imprecise",
                    key: "Sense",
                    range: 30,
                    selector: "scent",
                },
            },
            {
                levelMin: 18,
                type: "RuleElement",
                rule: {
                    key: "Sense",
                    selector: "greater-darkvision",
                },
            },
            // temporary roll options
            {
                levelMin: 4,
                levelMax: 5,
                type: "RuleElement",
                rule: {
                    key: "RollOption",
                    domain: "all",
                    label: lkey("temporary-low-light-vision"),
                    option: "imbue:sensory:temporary-low-light-vision",
                    toggleable: true,
                },
            },
            {
                levelMin: 4,
                levelMax: 5,
                type: "RuleElement",
                rule: {
                    key: "Sense",
                    selector: "low-light-vision",
                    predicate: ["imbue:sensory:temporary-low-light-vision"],
                },
            },
            {
                levelMin: 8,
                levelMax: 11,
                type: "RuleElement",
                rule: {
                    key: "RollOption",
                    domain: "all",
                    label: lkey("temporary-darkvision"),
                    option: "imbue:sensory:temporary-darkvision",
                    toggleable: true,
                },
            },
            {
                levelMin: 8,
                levelMax: 11,
                type: "RuleElement",
                rule: {
                    key: "Sense",
                    selector: "darkvision",
                    predicate: ["imbue:sensory:temporary-darkvision"],
                },
            },
            {
                levelMin: 14,
                levelMax: 15,
                type: "RuleElement",
                rule: {
                    key: "RollOption",
                    domain: "all",
                    label: lkey("temporary-scent"),
                    option: "imbue:sensory:temporary-scent",
                    toggleable: true,
                },
            },
            {
                levelMin: 14,
                levelMax: 15,
                type: "RuleElement",
                rule: {
                    acuity: "imprecise",
                    key: "Sense",
                    range: 30,
                    predicate: ["imbue:sensory:temporary-scent"],
                    selector: "scent",
                },
            },
        ],
    };
}
