import { i18nFormat, lkeygen, tkey } from "@src/utils";
import { helpers, Selector } from "@src/data/helpers";
import { MaterialData } from "@src/data/material";
import { RollString } from "@localTypes/global";

export function createImbueWild(): MaterialData {
    const damages = ["acid", "cold", "electricity", "fire", "void", "sonic"];
    const lkey = lkeygen("data.imbuement.battlezoo-bestiary.wild" as const);

    return {
        key: "imbue:wild:might",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [],
        header: {
            description: { type: "key", key: lkey("flavor") },
            labels: [
                ...helpers.leveledLabels(
                    [4, 6, 8, 18],
                    ["1", "1d4", "1d6", "1d8"],
                    (damage) => ({
                        text: {
                            type: "key",
                            key: lkey("might.damage"),
                            parameters: { damage: damage },
                        },
                        sort: 1,
                    }),
                ),

                {
                    levelMin: 12,
                    text: {
                        type: "key",
                        key: lkey("might.level-12-resistance"),
                    },
                    sort: 2,
                },
                {
                    levelMin: 20,
                    text: { type: "key", key: lkey("might.level-20-weakness") },
                    sort: 3,
                },
            ],
        },
        effects: [
            ...damages.flatMap((type, i) =>
                helpers.leveledEffects(
                    [4, 6, 8, 18],
                    ["1", "d4", "d6", "d8"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type,
                            value: damage,
                            predicate: [`wild:damage-type:${i + 1}`],
                            label: lkey("label"),
                            hideIfDisabled: true,
                        }),
                ),
            ),
            ...damages.map((type, i) => ({
                levelMin: 20,
                type: "RuleElement" as const,
                rule: {
                    key: "Note",
                    selector: Selector.ItemDamage,
                    text: i18nFormat({
                        type: "key",
                        key: tkey("data.imbuement.vulnerability-before-strike"),
                        parameters: {
                            damage: type,
                        },
                    }),
                    title: lkey("label"),
                    predicate: [`wild:damage-type:${i + 1}`],
                },
            })),
            {
                levelMin: 20,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["success", "criticalSuccess"],
                    text: lkey("might.effects.level-20-note"),
                    title: lkey("label"),
                    selector: [Selector.ItemDamage],
                },
            },
        ],
    };
}
