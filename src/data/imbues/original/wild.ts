import { i18nFormat, tkey } from "../../../utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "../../../types";
import { Wrappers } from "../../../wrappers";

export function createImbueWild(): MaterialData {
    const damages = ["acid", "cold", "electricity", "fire", "void", "sonic"];
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.wild"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.wild.${k}`);

    const imbue: MaterialData = {
        key: "imbue:wild:might",
        type: "imbuement",
        label: { type: "key", key: lkey("label") },
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
            {
                levelMin: 4,
                type: "RuleElement",
                rule: {
                    key: "RollOption",
                    option: "item:imbue:wild",
                    domain: "{item|_id}-damage",
                },
            },
            ...damages.flatMap((type, i) => {
                return helpers.leveledEffects(
                    [4, 6, 8, 18],
                    ["1", "d4", "d6", "d8"],
                    (damage: RollString) => {
                        const rule = helpers.damage.effect({
                            type,
                            value: damage,
                            predicate: [`wild:damage-type:${i + 1}`],
                            label: lkey("label"),
                        });
                        //@ts-expect-error
                        rule.rule.hideIfDisabled = true;
                        return rule;
                    },
                );
            }),
            ...damages.map((type, i) => ({
                levelMin: 20,
                type: "RuleElement" as "RuleElement",
                rule: {
                    key: "Note",
                    selector: "strike-damage",
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
        ],
    };

    Wrappers.registerWildImbuement();

    return imbue;
}
