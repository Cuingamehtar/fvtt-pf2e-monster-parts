import { tkey } from "../../../utils";
import { helpers } from "../../helpers";
import { MaterialData } from "../../material";
import { RollString } from "../../../types";

export function createImbueForce(): MaterialData[] {
    const lkey = (
        k: keyof Flatten<
            Nested<
                I18nKeyType,
                "pf2e-monster-parts.data.imbuement.battlezoo-bestiary.force"
            >
        >,
    ): I18nKey => tkey(`data.imbuement.battlezoo-bestiary.force.${k}`);

    const base = {
        type: "imbuement" as "imbuement",
        itemPredicate: ["item:type:weapon"],
        monsterPredicate: [
            {
                or: [
                    "self:trait:force",
                    {
                        or: [
                            {
                                and: [
                                    "item:type:melee",
                                    "item:damage:type:force",
                                ],
                            },
                            {
                                and: [
                                    "item:type:spell",
                                    "item:damage:type:force",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };
    return [
        {
            ...base,
            key: "imbue:force:magic",
            label: { type: "key", key: lkey("magic.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [10, 14, 18],
                        ["1", "d4", "d6"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "force",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 2,
                        text: {
                            type: "key",
                            key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                            parameters: {
                                spell: "@UUID[Compendium.pf2e.spells-srd.Item.TVKNbcgTee19PXZR]",
                            },
                        },
                        sort: 1,
                    },
                    ...helpers.leveledLabels(
                        [4, 6, 8, 12, 16],
                        [
                            "magic.level-4-spells",
                            "magic.level-6-spells",
                            "magic.level-8-spells",
                            "magic.level-12-spells",
                            "magic.level-16-spells",
                        ],
                        (key: Parameters<typeof lkey>[0]) => ({
                            text: { type: "key", key: lkey(key) },
                            sort: 2,
                        }),
                    ),
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("magic.level-20-spirit-song"),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [10, 14, 18],
                    ["1", "d4", "d6"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "force",
                            value: damage,
                            label: lkey("magic.label"),
                        }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:force:might",
            label: { type: "key", key: lkey("might.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    ...helpers.leveledLabels(
                        [4, 6, 8, 18],
                        ["1", "d4", "d6", "d8"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "force",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 10,
                        levelMax: 15,
                        text: {
                            type: "key",
                            key: lkey("might.level-10-push"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("might.level-16-push"),
                        },
                        sort: 1,
                    },
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
                        text: {
                            type: "key",
                            key: lkey("might.level-20-weakness"),
                        },
                        sort: 3,
                    },
                ],
            },
            effects: [
                ...helpers.leveledEffects(
                    [4, 6, 8, 18],
                    ["1", "d4", "d6", "d8"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "force",
                            value: damage,
                            label: lkey("might.label"),
                        }),
                ),
            ],
        },
        {
            ...base,
            key: "imbue:force:tech",
            label: { type: "key", key: lkey("tech.label") },
            header: {
                description: { type: "key", key: lkey("flavor") },
                labels: [
                    {
                        levelMin: 6,
                        ...helpers.damage.label({
                            type: "force",
                            value: 1,
                        }),
                    },
                    ...helpers.leveledLabels(
                        [4, 10],
                        ["1", "d6"],
                        (damage: RollString) =>
                            helpers.damage.label({
                                type: "force",
                                category: "persistent",
                                value: damage,
                            }),
                    ),
                    {
                        levelMin: 8,
                        levelMax: 13,
                        text: {
                            type: "key",
                            key: lkey("tech.level-8-push"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 14,
                        levelMax: 17,
                        text: {
                            type: "key",
                            key: lkey("tech.level-14-push"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 18,
                        text: {
                            type: "key",
                            key: lkey("tech.level-18-push"),
                        },
                        sort: 1,
                    },
                    {
                        levelMin: 16,
                        text: {
                            type: "key",
                            key: lkey("tech.level-16-off-guard"),
                        },
                        sort: 2,
                    },
                    {
                        levelMin: 12,
                        text: {
                            type: "key",
                            key: lkey("tech.level-12-resistance"),
                        },
                        sort: 3,
                    },
                    {
                        levelMin: 20,
                        text: {
                            type: "key",
                            key: lkey("tech.level-20-prone"),
                        },
                        sort: 4,
                    },
                ],
            },
            effects: [
                {
                    levelMin: 6,
                    ...helpers.damage.effect({
                        type: "force",
                        value: 1,
                        label: lkey("tech.label"),
                    }),
                },
                ...helpers.leveledEffects(
                    [4, 8, 14, 18],
                    ["1", "d6", "d8", "d10"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "force",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                        }),
                ),
            ],
        },
    ];
}
