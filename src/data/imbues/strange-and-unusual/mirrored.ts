import { i18nFormat, tkey } from "@src/utils";
import { MaterialData } from "../../material";
import { helpers } from "../../helpers";

export function createImbueMirrored(): MaterialData {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.strange-and-unusual.mirrored"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.strange-and-unusual.mirrored.${k}`);

    return {
        type: "imbuement",
        key: "imbue:mirrored",
        label: {
            type: "key",
            key: lkey("label"),
        },
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:shield"],
        monsterPredicate: ["never"],
        /*monsterPredicate: [
            { or: ["item:damage:type:piercing", "item:damage:type:slashing"] },
            "item:type:melee",
        ],*/
        header: {
            description: {
                type: "key",
                key: lkey("header.flavor"),
            },
            labels: [
                ...helpers.leveledLabels(
                    [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
                    helpers.sequentialData([
                        {
                            cost: "2",
                            frequency: lkey("header.frequency.per-day"),
                            damageTouch: "1",
                            damageGrapple: "1d4",
                        },
                        { damageTouch: "1d4", damageGrapple: "2d4" },
                        { damageTouch: "1d6", damageGrapple: "2d6" },
                        { damageTouch: "2d4", damageGrapple: "4d4" },
                        { damageTouch: "2d6", damageGrapple: "4d6" },
                        { frequency: lkey("header.frequency.per-hour") },
                        { damageTouch: "3d6", damageGrapple: "6d6" },
                        { cost: "1" },
                        { damageTouch: "4d6", damageGrapple: "8d6" },
                        { frequency: lkey("header.frequency.per-10-minutes") },
                    ]),
                    ({ cost, frequency, damageTouch, damageGrapple }) => ({
                        text: {
                            type: "key",
                            key: lkey("header.activation"),
                            parameters: {
                                cost,
                                frequency: i18nFormat({
                                    type: "key",
                                    key: frequency,
                                }),
                                damageGrapple,
                                damageTouch,
                            },
                        },
                        sort: 1,
                    }),
                ),
                {
                    levelMin: 20,
                    text: { type: "key", key: lkey("header.reaction") },
                    sort: 2,
                },
                ...helpers.leveledLabels(
                    [12, 18],
                    [
                        { damageTouch: "1d4", damageGrapple: "2d4" },
                        { damageTouch: "1d6", damageGrapple: "2d6" },
                    ],
                    ({ damageTouch, damageGrapple }) => ({
                        text: {
                            type: "key",
                            key: lkey("header.passive"),
                            parameters: {
                                damageGrapple,
                                damageTouch,
                            },
                        },
                        sort: 3,
                    }),
                ),
            ],
        },
        effects: [],
    };
}
