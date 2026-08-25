import { MaterialData } from "../material";
import { addTraits, helpers } from "../helpers";
import { I18n, never } from "@src/utils";
import * as R from "remeda";

export function createStaffRefinement(): MaterialData {
    const base = {
        key: `refinement:staff`,
        type: "imbuement" as const,
        label: I18n.key("pf2e-monster-parts.data.refinement.staff.label"),
        description: I18n.key(
            "pf2e-monster-parts.data.refinement.staff.description",
        ),
        itemPredicate: [
            "item:type:weapon",
            { not: "item:tag:handwraps-of-mighty-blows" },
        ],
        monsterPredicate: never,
        header: {},
    };
    return R.pipe(
        base,
        helpers.addEffects({
            ...addTraits("staff")[0],
            levelMin: 3,
        }),
        helpers.addLabels({
            levelMin: 3,
            text: I18n.key("pf2e-monster-parts.data.refinement.staff.cantrip"),
            sort: 1,
        }),
        helpers.addLabels(
            helpers.leveledLabels(
                [5, 7, 9, 11, 13, 15, 17, 19],
                [1, 2, 3, 4, 5, 6, 7, 8],
                (rank) => ({
                    text: I18n.key(
                        "pf2e-monster-parts.data.refinement.staff.spells",
                        { rank },
                    ),
                    sort: 2,
                }),
            ),
        ),
    );
}
