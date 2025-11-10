import { tkey } from "../../../utils";
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
    const senses = Object.keys(CONFIG.PF2E.senses).map(
        (s) => `self:sense:${s}`,
    );
    return {
        key: "imbue:sensory",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
        description: { type: "key", key: lkey("description") },
        monsterPredicate: [{ or: senses }],
        itemPredicate: [
            {
                gte: [`item:refinement:perception`, 0],
            },
        ],
        header: {
            description: { type: "key", key: lkey("flavor") },
            labels: [
                {
                    levelMin: 6,
                    levelMax: 11,
                    text: {
                        type: "key",
                        key: lkey("level-6-permanent-low-light"),
                    },
                    sort: 1,
                },
                {
                    levelMin: 12,
                    levelMax: 17,
                    text: {
                        type: "key",
                        key: lkey("level-12-permanent-darkvision"),
                    },
                    sort: 1,
                },
                {
                    levelMin: 16,
                    levelMax: 17,
                    text: {
                        type: "key",
                        key: lkey("level-16-permanent-scent"),
                    },
                    sort: 1,
                },
                {
                    levelMin: 18,
                    text: {
                        type: "key",
                        key: lkey("level-18-permanent"),
                    },
                    sort: 1,
                },
                {
                    levelMin: 4,
                    levelMax: 5,
                    text: {
                        type: "key",
                        key: lkey("level-4-activation-low-light"),
                    },
                    sort: 2,
                },
                {
                    levelMin: 8,
                    levelMax: 11,
                    text: {
                        type: "key",
                        key: lkey("level-8-activation-darkvision"),
                    },
                    sort: 2,
                },
                {
                    levelMin: 14,
                    levelMax: 15,
                    text: {
                        type: "key",
                        key: lkey("level-14-activation-scent"),
                    },
                    sort: 2,
                },
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
        ],
    };
}
