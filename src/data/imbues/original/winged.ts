import { t, tkey } from "../../../utils";
import { ImbueSource } from "../../data-types";
import { levelRange } from "../../helpers";

export function createImbueWinged(): ImbueSource {
    return {
        key: "imbue:winged",
        type: "imbue",
        label: t("imbue.winged.label"),
        flavor: tkey("imbue.winged.flavor"),
        itemPredicate: ["item:type:armor"],
        monsterPredicate: ["self:speed:fly"],
        effects: [
            {
                ...levelRange(6, 7),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.winged.level-6"),
                    },
                ],
            },
            {
                ...levelRange(8),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.winged.level-8"),
                    },
                ],
            },
            {
                ...levelRange(10, 13),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.winged.level-10"),
                    },
                ],
            },
            {
                ...levelRange(14, 17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.winged.level-14"),
                    },
                ],
            },
            {
                ...levelRange(16, 17),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.winged.level-16"),
                    },
                ],
            },
            {
                ...levelRange(18),
                effects: [
                    {
                        key: "RuleElement",
                        rule: {
                            key: "BaseSpeed",
                            selector: "fly",
                            value: "@actor.system.attributes.speed.total",
                        },
                    },
                    {
                        key: "InlineNote",
                        text: tkey("imbue.winged.level-18"),
                    },
                ],
            },
            {
                ...levelRange(20),
                effects: [
                    {
                        key: "InlineNote",
                        text: tkey("imbue.winged.level-20"),
                    },
                ],
            },
        ],
    };
}
