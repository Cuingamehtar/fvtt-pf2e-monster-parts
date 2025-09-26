import { tkey } from "../../../utils";
import { skillsOfAttribute } from "../../helpers";
import { MaterialData } from "../../material";

export function createImbueDexterity(): MaterialData {
    const skills = skillsOfAttribute("dex");
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.dexterity"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.dexterity.${k}`);

    return {
        key: "imbue:dexterity",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
        monsterPredicate: [{ lte: ["ability:dex:rank", 2] }],
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
                    text: lkey("level-8-speed"),
                    sort: 1,
                },
                {
                    levelMin: 14,
                    levelMax: 19,
                    text: lkey("level-14-speed"),
                    sort: 1,
                },
                {
                    levelMin: 20,
                    text: lkey("level-20-speed"),
                    sort: 1,
                },
                {
                    levelMin: 17,
                    text: lkey("level-17-apex"),
                    sort: 2,
                },
            ],
        },
        effects: [],
    };
}
