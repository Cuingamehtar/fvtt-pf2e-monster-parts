import * as fs from "node:fs/promises";
import * as path from "node:path";

const filename = "Effect__Might_Path_Damage_Weakness_ezzdeD7d0ra6b3TX.json";

const data = JSON.parse(
    await fs.readFile(
        path.join("packs/activations-and-effects/_source", filename),
        "utf-8",
    ),
);

const weaknessTypes = {
    air: {
        label: "PF2E.TraitAir",
        imbuements: ["imbue:air:might"],
        definition: ["item:trait:air"],
    },
    acid: {
        label: "PF2E.TraitAcid",
        imbuements: ["imbue:acid:might", "imbue:wild:might"],
        wildDamageType: "wild:damage-type:1",
    },
    cold: {
        label: "PF2E.TraitCold",
        imbuements: ["imbue:cold:might", "imbue:ice:might", "imbue:wild:might"],
        wildDamageType: "wild:damage-type:2",
    },
    electricity: {
        label: "PF2E.TraitElectricity",
        imbuements: ["imbue:electricity:might", "imbue:wild:might"],
        wildDamageType: "wild:damage-type:3",
    },
    darkness: {
        label: "PF2E.TraitDarkess",
        imbuements: ["imbue:darkness:might"],
        definition: ["item:trait:darkness"],
    },
    fire: {
        label: "PF2E.TraitFire",
        imbuements: ["imbue:fire:might", "imbue:wild:might"],
        wildDamageType: "wild:damage-type:4",
    },
    force: {
        label: "PF2E.TraitForce",
        imbuements: ["imbue:force:might"],
    },
    holy: {
        label: "PF2E.TraitHoly",
        imbuements: ["imbue:holy:might"],
    },
    mental: {
        label: "PF2E.TraitMental",
        imbuements: ["imbue:mind:might"],
    },
    morph: {
        label: "PF2E.TraitMorph",
        imbuements: ["imbue:body:might"],
        definition: ["item:trait:morph"],
    },
    poison: {
        label: "PF2E.TraitPoison",
        imbuements: ["imbue:poison:might"],
    },
    sonic: {
        label: "PF2E.TraitSonic",
        imbuements: ["imbue:sonic:might", "imbue:wild:might"],
        wildDamageType: "wild:damage-type:6",
    },
    vitality: {
        label: "PF2E.TraitVitality",
        imbuements: ["imbue:life:might"],
    },
    void: {
        label: "PF2E.TraitVoid",
        imbuements: ["imbue:death:might", "imbue:wild:might"],
        wildDamageType: "wild:damage-type:5",
    },
};

function commonWeaknessRE(weaknessTypes) {
    const predicate = Object.entries(weaknessTypes)
        .filter(([_, v]) => !v.definition)
        .map(([k, _]) => `might-path-weakness:${k}`);
    return {
        key: "Weakness",
        value: 1,
        type: "{item|flags.pf2e.rulesSelections.damageType}",
        predicate: [{ or: predicate }],
    };
}

function weaknessRE(type, value) {
    return {
        key: "Weakness",
        label: value.label,
        value: 1,
        type: value.definition ? "custom" : type,
        definition: value.definition,
        predicate: [`might-path-weakness:${type}`],
    };
}

const choiceRE = {
    choices: Object.entries(weaknessTypes).map(([type, w]) => {
        const predicate = [
            {
                or: [
                    ...w.imbuements.map((imb) => {
                        return {
                            gte: [`parent:origin:item:${imb}`, 20],
                        };
                    }),
                    {
                        not: "parent:origin:item",
                    },
                ],
            },
        ];
        return {
            label: w.label,
            value: type,
            predicate,
        };
    }),
    rollOption: "might-path-weakness",
    flag: "damageType",
    key: "ChoiceSet",
    prompt: "PF2E.SpecificRule.Prompt.DamageType",
};

data.system.rules = [
    choiceRE,
    commonWeaknessRE(weaknessTypes),
    ...Object.entries(weaknessTypes)
        .filter(([_, v]) => v.definition)
        .map(([type, value]) => weaknessRE(type, value)),
];

await fs.writeFile(
    path.join("packs/activations-and-effects/_source", filename),
    JSON.stringify(data, null, 2),
);
