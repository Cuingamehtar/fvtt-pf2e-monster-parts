import { I18n, lkeygen } from "@src/utils";
import { MaterialData } from "../../material";
import * as R from "remeda";
import { helpers } from "@data/helpers";

export function createImbueSpaceShield(): MaterialData {
    const lkey = lkeygen(
        "data.imbuement.elemental-storm.space-shield" as const,
    );

    const base: MaterialData = {
        type: "imbuement" as const,
        key: "imbue:space-shield",
        label: I18n.key(lkey("label")),
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:shield"],
        // The creature must be associated with space or have an ability or spell with the
        // teleportation trait (creature with the teleportation trait also work, but they
        // usually don’t have that trait).
        monsterPredicate: [
            {
                or: [
                    "self:trait:teleportation",
                    {
                        and: [
                            {
                                or: [
                                    "item:type:action",
                                    "item:type:spell",
                                    "item:type:melee",
                                ],
                            },
                            "item:trait:teleportation",
                        ],
                    },
                ],
            },
        ],
        header: {
            description: I18n.key(lkey("header.flavor")),
        },
    };

    return R.pipe(
        base,

        helpers.addGroup({
            labels: {
                levelMin: 4,
                text: I18n.key(lkey("header.level-4-shield-block")),
                sort: 1,
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 6,
                text: I18n.key(lkey("header.level-6-block-teleport"), {
                    distance: I18n.resolve(
                        "@actor.flags.system.spaceShieldImbuementBlockTeleport",
                        true,
                    ),
                }),

                sort: 2,
            },
            effects: {
                levelMin: 6,
                type: "RuleElement",
                rule: {
                    key: "ActiveEffectLike",
                    mode: "override",
                    path: "flags.system.spaceShieldImbuementBlockTeleport",
                    value: "ternary(gte(@item.flags.pf2e-monster-parts.values.imbueSpaceShieldLevel, 20), 30, ternary(gte(@item.flags.pf2e-monster-parts.values.imbueSpaceShieldLevel, 12), 20, 10))",
                },
            },
        }),

        helpers.addGroup({
            labels: helpers.leveledLabels(
                [8, 14, 18],
                [
                    "header.level-8-redirect",
                    "header.level-14-redirect",
                    "header.level-18-redirect",
                ],
                (key: Parameters<typeof lkey>[0]) => ({
                    text: I18n.key(lkey(key), {
                        distance: I18n.resolve(
                            "@actor.flags.system.spaceShieldImbuementRedirectDistance",
                            true,
                        ),
                        mod: I18n.resolve(
                            "@actor.flags.system.spaceShieldImbuementRedirectMod",
                            true,
                        ),
                    }),
                    sort: 2,
                }),
            ),
            effects: [
                {
                    levelMin: 8,
                    type: "RuleElement",
                    rule: {
                        key: "ActiveEffectLike",
                        mode: "override",
                        path: "flags.system.spaceShieldImbuementRedirectDistance",
                        value: "ternary(gte(@item.flags.pf2e-monster-parts.values.imbueSpaceShieldLevel, 20), 60, 30)",
                    },
                },
                {
                    levelMin: 8,
                    type: "RuleElement",
                    rule: {
                        key: "ActiveEffectLike",
                        mode: "override",
                        path: "flags.system.spaceShieldImbuementRedirectMod",
                        value: "14 +@item.level +floor(@item.level /3) +max(@item.level -21,0) -max(@item.level -23, 0) +max(@item.level -24, 0) -10",
                    },
                },
            ],
        }),

        helpers.addGroup({
            labels: {
                levelMin: 10,
                text: I18n.key(lkey("header.level-10-raised-teleport"), {
                    distance: I18n.resolve(
                        "@actor.flags.system.spaceShieldImbuementRaiseTeleport",
                        true,
                    ),
                }),
                sort: 4,
            },
            effects: {
                levelMin: 10,
                type: "RuleElement",
                rule: {
                    key: "ActiveEffectLike",
                    mode: "override",
                    path: "flags.system.spaceShieldImbuementRaiseTeleport",
                    value: "ternary(gte(@item.flags.pf2e-monster-parts.values.imbueSpaceShieldLevel, 20), 30, ternary(gte(@item.flags.pf2e-monster-parts.values.imbueSpaceShieldLevel, 16), 20, 10))",
                },
            },
        }),

        helpers.addGroup({
            labels: {
                levelMin: 20,
                text: I18n.key(lkey("header.level-20-free-redirect")),
                sort: 5,
            },
        }),
    );
}
