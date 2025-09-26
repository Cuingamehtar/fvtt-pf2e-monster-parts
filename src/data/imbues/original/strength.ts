import { tkey } from "../../../utils";
import { skillsOfAttribute } from "../../helpers";
import { MaterialData } from "../../material";

export function createImbueStrength(): MaterialData {
    const skills = skillsOfAttribute("str");
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.strength"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.strength.${k}`);

    return {
        key: "imbue:strength",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
        monsterPredicate: [{ lte: ["ability:str:rank", 2] }],
        itemPredicate: [
            {
                or: skills.map((s) => ({
                    gte: [`refinement:skill:${s}`, 0],
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
        effects: [],
    };
}
