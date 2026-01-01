import { tkey } from "@src/utils";
import { skillsOfAttribute } from "../../helpers";
import { MaterialData } from "../../material";

export function createImbueIntelligence(): MaterialData {
    const skills = skillsOfAttribute("int");
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.intelligence"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.intelligence.${k}`);

    return {
        key: "imbue:intelligence",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
        description: { type: "key", key: lkey("description") },
        monsterPredicate: [{ lte: ["self:ability:int:rank", 2] }],
        itemPredicate: [
            {
                or: skills.map((s) => ({
                    gte: [`item:refinement:skill:${s}`, 0],
                })),
            },
        ],
        header: {
            description: { type: "key", key: lkey("flavor") },
            labels: [
                {
                    levelMin: 8,
                    levelMax: 13,
                    text: { type: "key", key: lkey("level-8-spell") },
                    sort: 1,
                },
                {
                    levelMin: 14,
                    levelMax: 19,
                    text: { type: "key", key: lkey("level-14-spell") },
                    sort: 1,
                },
                {
                    levelMin: 20,
                    text: { type: "key", key: lkey("level-20-spell") },
                    sort: 1,
                },
                {
                    levelMin: 17,
                    text: { type: "key", key: lkey("level-17-apex") },
                    sort: 2,
                },
            ],
        },
        effects: [
            { levelMin: 0, levelMax: 16, type: "Apex", attribute: null },
            {
                levelMin: 17,
                type: "Apex",
                attribute: "int",
            },
        ],
    };
}
