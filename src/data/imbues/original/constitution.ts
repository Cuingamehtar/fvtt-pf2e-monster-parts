import { SkillSlug } from "foundry-pf2e";
import { tkey } from "@src/utils";
import { MaterialData } from "../../material";

export function createImbueConstitution(): MaterialData {
    const skills = Object.keys(CONFIG.PF2E.skills) as SkillSlug[];
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.constitution"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.constitution.${k}`);

    return {
        key: "imbue:constitution",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
        description: { type: "key", key: lkey("description") },
        monsterPredicate: [{ lte: ["self:ability:con:rank", 2] }],
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
                    levelMax: 17,
                    text: { type: "key", key: lkey("level-14-spell") },
                    sort: 1,
                },
                {
                    levelMin: 18,
                    text: { type: "key", key: lkey("level-18-spell") },
                    sort: 1,
                },
                {
                    levelMin: 17,
                    text: { type: "key", key: lkey("level-17-apex") },
                    sort: 2,
                },
                {
                    levelMin: 20,
                    text: { type: "key", key: lkey("level-20-hp") },
                    sort: 3,
                },
            ],
        },
        effects: [
            { levelMin: 0, levelMax: 16, type: "Apex", attribute: null },
            {
                levelMin: 17,
                type: "Apex",
                attribute: "con",
            },
        ],
    };
}
