import { i18nFormat, lkeygen } from "@src/utils";
import { helpers, Selector } from "../../helpers";
import { RollString } from "@localTypes/global";
import { MaterialData } from "../../material";
import { Spells } from "@data/spells";
import * as R from "remeda";

export function createImbueUnholy(): MaterialData[] {
    const lkey = lkeygen("data.imbuement.elemental-storm.unholy" as const);

    const base = {
        type: "imbuement" as const,
        itemPredicate: ["item:type:weapon"],
        // The monster must have an unholy trait or an ability or spell with the unholy trait.
        monsterPredicate: [
            {
                or: [
                    "self:trait:unholy",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:melee",
                                    "item:type:spell",
                                ],
                            },
                            {
                                or: ["item:trait:unholy"],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const magic = R.pipe(
        {
            ...base,
            key: "imbue:unholy:magic",
            label: { type: "key", key: lkey("magic.label") },
            description: { type: "key", key: lkey("magic.description") },
            spellTraditions: ["divine"],
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },
        helpers.addLabels(
            helpers.leveledLabels(
                [12, 14, 18],
                helpers.sequentialData(
                    {
                        damageHoly: "1",
                        key: lkey("strike-holy-only"),
                    },
                    {
                        damageHoly: "1d6",
                        damageNormal: "1",
                        key: lkey("strike-normal-and-holy"),
                    },
                    { damageHoly: "2d4", damageNormal: "1d4" },
                ),
                ({
                    damageHoly,
                    damageNormal,
                    key,
                }: {
                    damageHoly: string;
                    damageNormal: string;
                    key: I18nKey;
                }) => ({
                    text: {
                        type: "key",
                        key: key,
                        parameters: {
                            damageHoly: i18nFormat({
                                type: "key",
                                key: "pf2e-monster-parts.damage.type.spirit",
                                parameters: { value: damageHoly },
                            }),
                            damageNormal: i18nFormat({
                                type: "key",
                                key: "pf2e-monster-parts.damage.type.spirit",
                                parameters: { value: damageNormal },
                            }),
                        },
                    },
                    sort: -1,
                }),
            ),
        ),
        helpers.addEffects(
            helpers.leveledEffects(
                [14, 18],
                ["1", "d4"],
                (damage: RollString) =>
                    helpers.damage.effect({
                        type: "spirit",
                        value: damage,
                        label: lkey("magic.label"),
                        predicate: [{ not: "target:trait:holy" }],
                    }),
            ),
        ),
        helpers.addEffects(
            helpers.leveledEffects(
                [10, 14, 18],
                ["1", "d6", "2d6"],
                (damage: RollString) =>
                    helpers.damage.effect({
                        type: "spirit",
                        value: damage,
                        label: lkey("against-holy"),
                        predicate: ["target:trait:holy"],
                        hideIfDisabled: true,
                    }),
            ),
        ),
        helpers.addLabels({
            levelMin: 2,
            text: {
                type: "key",
                key: "pf2e-monster-parts.data.imbuement.add-cantrip",
                parameters: {
                    spell: `@UUID[${Spells.DivineLance}]` as I18nString,
                },
            },
            sort: 1,
        }),
        helpers.addEffects(
            helpers.cantripActivation({
                uuid: Spells.DivineLance,
            }),
        ),
        helpers.addLabels(
            helpers.leveledLabels(
                [4, 8, 10, 16, 20],
                [
                    "magic.header.level-4-spells",
                    "magic.header.level-8-spells",
                    "magic.header.level-10-spells",
                    "magic.header.level-16-spells",
                    "magic.header.level-20-spells",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: { type: "key", key: lkey(key) },
                    sort: 2,
                }),
            ),
        ),
        helpers.addEffects([
            {
                levelMin: 4,
                ...helpers.spellActivation({
                    uuid: Spells.Protection,
                }),
            },
            {
                levelMin: 8,
                ...helpers.spellActivation({
                    uuid: Spells.ChillingDarkness,
                }),
            },
            ...helpers.leveledEffects([10, 16, 20], [undefined, 5, 6], (rank) =>
                helpers.spellActivation({
                    uuid: Spells.DivineWrath,
                    rank,
                }),
            ),
            {
                levelMin: 16,
                ...helpers.spellActivation({
                    uuid: Spells.DivineDecree,
                }),
            },
            {
                levelMin: 20,
                ...helpers.spellActivation({
                    uuid: Spells.WeaponOfJudgement,
                }),
            },
        ]),
    );

    const might = R.pipe(
        {
            ...base,
            key: "imbue:unholy:might",
            label: { type: "key", key: lkey("might.label") },
            description: { type: "key", key: lkey("might.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },
        helpers.addGroup({
            labels: helpers.leveledLabels(
                [4, 8, 10, 18],
                helpers.sequentialData(
                    {
                        damageHoly: "1",
                        key: lkey("strike-holy-only"),
                    },
                    {
                        damageHoly: "1d6",
                        damageNormal: "1",
                        key: lkey("strike-normal-and-holy"),
                    },
                    { damageHoly: "1d8", damageNormal: "1d4" },
                    { damageHoly: "1d12", damageNormal: "1d6" },
                ),
                ({
                    damageHoly,
                    damageNormal,
                    key,
                }: {
                    damageHoly: string;
                    damageNormal: string;
                    key: I18nKey;
                }) => ({
                    text: {
                        type: "key",
                        key: key,
                        parameters: {
                            damageHoly: i18nFormat({
                                type: "key",
                                key: "pf2e-monster-parts.damage.type.spirit",
                                parameters: { value: damageHoly },
                            }),
                            damageNormal: i18nFormat({
                                type: "key",
                                key: "pf2e-monster-parts.damage.type.spirit",
                                parameters: { value: damageNormal },
                            }),
                        },
                    },
                    sort: -1,
                }),
            ),
            effects: [
                ...helpers.leveledEffects(
                    [8, 10, 18],
                    ["1", "d4", "d6"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "spirit",
                            value: damage,
                            label: lkey("might.label"),
                            predicate: [{ not: "target:trait:holy" }],
                            hideIfDisabled: true,
                        }),
                ),
                ...helpers.leveledEffects(
                    [6, 8, 10, 18],
                    ["1", "d6", "d8", "d12"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "spirit",
                            value: damage,
                            label: lkey("against-holy"),
                            predicate: ["target:trait:holy"],
                            hideIfDisabled: true,
                        }),
                ),
            ],
        }),
        helpers.addGroup({
            labels: {
                levelMin: 12,
                text: {
                    type: "key",
                    key: lkey("might.header.level-12-persistent"),
                },
                sort: 1,
            },
            effects: {
                levelMin: 12,
                ...helpers.damage.effect({
                    type: "bleed",
                    category: "persistent",
                    value: "2d8",
                    label: lkey("might.label"),
                    critical: true,
                    selector: Selector.ItemDamage,
                }),
            },
        }),
        helpers.addGroup({
            labels: {
                levelMin: 14,
                text: {
                    type: "key",
                    key: lkey("might.header.level-14-resistance"),
                },
                sort: 2,
            },
            effects: {
                levelMin: 14,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("might.effects.level-14-resistance"),
                    title: lkey("might.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),
        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: {
                    type: "key",
                    key: lkey("might.header.level-20-weakness"),
                },
                sort: 3,
            },
            effects: {
                levelMin: 20,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["success", "criticalSuccess"],
                    text: lkey("might.effects.level-20-weakness"),
                    title: lkey("might.label"),
                    predicate: [{ not: "target:trait:holy" }],
                    selector: [Selector.ItemAttack],
                },
            },
        }),
    );

    const tech = R.pipe(
        {
            ...base,
            key: "imbue:unholy:tech",
            label: { type: "key", key: lkey("tech.label") },
            description: { type: "key", key: lkey("tech.description") },
            header: {
                description: { type: "key", key: lkey("flavor") },
            },
        },
        helpers.addGroup({
            labels: {
                levelMin: 6,
                text: {
                    type: "key",
                    key: lkey("strike-holy-only"),
                    parameters: {
                        damageHoly: i18nFormat({
                            type: "key",
                            key: "pf2e-monster-parts.damage.type.spirit",
                            parameters: { value: 1 },
                        }),
                    },
                },
                sort: -1,
            },
            effects: {
                levelMin: 6,
                ...helpers.damage.effect({
                    type: "spirit",
                    value: 1,
                    label: lkey("tech.label"),
                    predicate: [{ not: "target:trait:holy" }],
                    hideIfDisabled: true,
                }),
            },
        }),
        helpers.addGroup({
            labels: [
                ...helpers.leveledLabels(
                    [8, 10, 18],
                    helpers.sequentialData(
                        {
                            damageHoly: "1",
                            key: lkey("persistent-holy-only"),
                        },
                        {
                            damageHoly: "d8",
                            damageNormal: "d4",
                            key: lkey("persistent-normal-and-holy"),
                        },
                        { damageHoly: "2d8", damageNormal: "d8" },
                    ),
                    ({
                        damageHoly,
                        damageNormal,
                        key,
                    }: {
                        damageHoly: string;
                        damageNormal: string;
                        key: I18nKey;
                    }) => ({
                        text: {
                            type: "key",
                            key: key,
                            parameters: {
                                damageHoly: i18nFormat({
                                    type: "key",
                                    key: "pf2e-monster-parts.damage.type.persistentSpirit",
                                    parameters: { value: damageHoly },
                                }),
                                damageNormal: i18nFormat({
                                    type: "key",
                                    key: "pf2e-monster-parts.damage.type.persistentSpirit",
                                    parameters: { value: damageNormal },
                                }),
                            },
                        },
                        sort: -1,
                    }),
                ),
            ],
            effects: [
                ...helpers.leveledEffects(
                    [10, 18],
                    ["d4", "d8"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "spirit",
                            category: "persistent",
                            value: damage,
                            label: lkey("tech.label"),
                            predicate: [{ not: "target:trait:holy" }],
                            hideIfDisabled: true,
                        }),
                ),
                ...helpers.leveledEffects(
                    [8, 10, 18],
                    ["1", "d8", "2d8"],
                    (damage: RollString) =>
                        helpers.damage.effect({
                            type: "spirit",
                            category: "persistent",
                            value: damage,
                            label: lkey("against-holy"),
                            predicate: ["target:trait:holy"],
                            hideIfDisabled: true,
                        }),
                ),
            ],
        }),
        helpers.addGroup({
            labels: {
                levelMin: 12,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-12-penalty"),
                },
                sort: 1,
            },
            effects: {
                levelMin: 12,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    outcome: ["criticalSuccess"],
                    predicate: ["target:trait:holy"],
                    text: lkey("tech.effects.level-12-penalty"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemAttack],
                },
            },
        }),
        helpers.addGroup({
            labels: {
                levelMin: 14,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-14-resistance"),
                },
                sort: 2,
            },
            effects: {
                levelMin: 14,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    text: lkey("tech.effects.level-14-resistance"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),
        helpers.addGroup({
            labels: {
                levelMin: 16,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-16-retaliate"),
                },
                sort: 3,
            },
            effects: {
                levelMin: 16,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    predicate: ["target:trait:holy"],
                    outcome: ["criticalSuccess"],
                    text: lkey("tech.effects.level-16-retaliate"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemAttack],
                },
            },
        }),
        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: {
                    type: "key",
                    key: lkey("tech.header.level-20-acceleration"),
                },
                sort: 4,
            },
            effects: {
                levelMin: 20,
                type: "RuleElement",
                rule: {
                    key: "Note",
                    predicate: ["target:trait:holy"],
                    text: lkey("tech.effects.level-20-acceleration"),
                    title: lkey("tech.label"),
                    selector: [Selector.ItemDamage],
                },
            },
        }),
    );

    return [magic, might, tech];
}
