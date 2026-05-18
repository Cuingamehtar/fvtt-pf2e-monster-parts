import { lkeygen } from "@src/utils";
import { MaterialData } from "../../material";
import * as R from "remeda";
import { helpers } from "@data/helpers";

export function createImbueMirrored(): MaterialData {
    const lkey = lkeygen(
        "data.imbuement.strange-and-unusual.mirrored" as const,
    );

    const base: MaterialData = {
        type: "imbuement" as const,
        key: "imbue:mirrored",
        label: {
            type: "key",
            key: lkey("label"),
        },
        description: { type: "key", key: lkey("description") },
        itemPredicate: ["item:type:shield"],
        monsterPredicate: ["never"],
        header: {
            description: {
                type: "key",
                key: lkey("flavor"),
            },
        },
    };
    return R.pipe(
        base,
        helpers.addLabels(
            helpers.leveledLabels(
                [2, 4, 6, 10, 12, 16],
                helpers.sequentialData(
                    {
                        frequency: lkey("header.frequency.per-day"),
                        trigger: lkey("header.trigger.strike-critical-miss"),
                        effect: lkey("header.effect.level-2"),
                    },
                    { frequency: lkey("header.frequency.per-hour") },
                    { effect: lkey("header.effect.level-6") },
                    {
                        trigger: lkey(
                            "header.trigger.strike-or-spell-critical-miss",
                        ),
                        effect: lkey("header.effect.level-10"),
                    },
                    { frequency: lkey("header.frequency.per-10-minutes") },
                    {
                        trigger: lkey("header.trigger.strike-or-spell-miss"),
                    },
                ),
                ({ frequency, trigger, effect }) => ({
                    text: {
                        type: "key",
                        key: lkey("header.activation"),
                        parameters: {
                            frequency: { type: "key", key: frequency },
                            trigger: { type: "key", key: trigger },
                            effect: { type: "key", key: effect },
                        },
                    },
                }),
            ),
        ),
        helpers.addLabels({
            levelMin: 20,
            text: { type: "key", key: lkey("header.level-20-activation") },
        }),
    );
}
