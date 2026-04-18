import { tkey } from "@src/utils";
import { MaterialData } from "../../material";
import { helpers } from "@data/helpers";

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
        description: { type: "key", key: lkey("description") },
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
                    levelMax: 13,
                    text: { type: "key", key: lkey("level-10-fly") },
                    sort: 1,
                },
                {
                    levelMin: 14,
                    levelMax: 15,
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
                    text: { type: "key", key: lkey("level-18-speed") },
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
                levelMin: 6,
                ...helpers.spellActivation({
                    uuid: "Compendium.pf2e.spells-srd.Item.TTwOKGqmZeKSyNMH",
                    rank: 1,
                }),
            },
            ...helpers.leveledEffects([10, 14], [1, undefined], (max) =>
                helpers.spellActivation({
                    uuid: "Compendium.pf2e.spells-srd.Item.A2JfEKe6BZcTG1S8",
                    rank: 4,
                    max,
                }),
            ),
            {
                levelMin: 18,
                type: "RuleElement",
                rule: {
                    key: "BaseSpeed",
                    selector: "fly",
                    value: "@actor.system.movement.speeds.land.value",
                },
            },
        ],
    };
}
