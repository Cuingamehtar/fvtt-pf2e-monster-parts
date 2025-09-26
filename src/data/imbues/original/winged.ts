import { tkey } from "../../../utils";
import { MaterialData } from "../../material";

export function createImbueWinged(): MaterialData {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.winged"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.winged.${k}`);

    return {
        key: "imbue:winged",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
        itemPredicate: ["item:type:armor"],
        monsterPredicate: ["self:speed:fly"],
        header: {
            description: { type: "key", key: lkey("flavor") },
            labels: [
                {
                    levelMin: 6,
                    levelMax: 7,
                    text: { type: "key", key: lkey("level-6-landing") },
                    sort: 1,
                },
                {
                    levelMin: 8,
                    text: { type: "key", key: lkey("level-8-landing") },
                    sort: 1,
                },
                {
                    levelMin: 10,
                    text: { type: "key", key: lkey("level-10-fly") },
                    sort: 1,
                },
                {
                    levelMin: 14,
                    text: { type: "key", key: lkey("level-14-fly") },
                    sort: 1,
                },
                {
                    levelMin: 16,
                    text: { type: "key", key: lkey("level-16-fly-extend") },
                    sort: 2,
                },
                {
                    levelMin: 18,
                    text: { type: "key", key: lkey("level-18-fly") },
                    sort: 0,
                },
                {
                    levelMin: 20,
                    text: { type: "key", key: lkey("level-20-ally") },
                    sort: 3,
                },
            ],
        },
        effects: [
            {
                levelMin: 18,
                type: "RuleElement",
                rule: {
                    key: "BaseSpeed",
                    selector: "fly",
                    value: "@actor.system.attributes.speed.total",
                },
            },
        ],
    };
}
