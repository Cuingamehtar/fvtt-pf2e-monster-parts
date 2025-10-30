import { PredicateStatement } from "foundry-pf2e";
import { effectField } from "./effect-handlers";
import { RuleElementEffect } from "./effect-handlers/rule-element";
import { AlterationEffect } from "./effect-handlers/alteration";

const f = foundry.data.fields;

class I18EntryField extends foundry.data.fields.DataField {
    override _validateType(value: any) {
        super._validateType(value);
        if (typeof value === "number") return;
        if (typeof value === "string") {
            if (game.i18n.has(value))
                throw new Error(
                    `Non-localized string "${value}" matches localizable key`,
                );
            return true;
        }
        if (!("type" in value))
            throw new Error(
                'Localizable field is not a string and doesn\'t contain a "type" property',
            );
        if (value.type === "key") {
            if (!game.i18n.has(value.key))
                throw new Error(`Unknown localization key: ${value.key}`);
            if ("parameters" in value) {
                if (typeof value.parameters !== "object")
                    throw new Error(
                        "Expected localizable.parameters to be an object",
                    );

                for (const p of Object.values(value.parameters)) {
                    this._validateType(p);
                }
            }
        } else if (value.type == "resolve") {
            if (typeof value.value !== "string" || !value.value.includes("@"))
                throw new Error("Resolvable field contains noting to resolve");
        } else {
            throw new Error(`Unknown localizable field type: ${value.type}`);
        }
    }
}

class PredicateField extends foundry.data.fields.DataField {
    override _validateType(value: any) {
        super._validateType(value);

        if (!game.pf2e.Predicate.isValid(value))
            throw new Error("Predicate is not valid", value);
    }
}

export type BaseMaterialEffect = {
    levelMin: number;
    levelMax?: number;
};

export type MaterialEffect = RuleElementEffect | AlterationEffect;

export type HeaderLabel = {
    text: I18nEntry;
    levelMin: number;
    levelMax?: number;
    sort?: number;
    predicate?: PredicateStatement[];
};
export type MaterialData = {
    key: string;
    type: "refinement" | "imbuement";
    label: I18nEntry;
    description?: I18nEntry;
    itemPredicate: PredicateStatement[];
    monsterPredicate: PredicateStatement[];
    header: {
        description?: I18nEntry;
        labels?: HeaderLabel[];
    };
    effects?: MaterialEffect[];
};

export const materialDataSchema = new f.SchemaField({
    key: new f.StringField({ required: true }),
    type: new f.StringField({
        choices: ["refinement", "imbuement"],
        required: true,
    }),
    label: new I18EntryField({ required: true }),
    description: new I18EntryField({ required: false }),
    itemPredicate: new PredicateField({ required: true }),
    monsterPredicate: new PredicateField({ required: true }),
    header: new f.SchemaField({
        description: new I18EntryField({ required: false }),
        labels: new f.ArrayField(
            new f.SchemaField(
                {
                    levelMin: new f.NumberField({ required: true }),
                    levelMax: new f.NumberField({ required: false }),
                    text: new I18EntryField({ required: true }),
                    sort: new f.NumberField({ required: false }),
                    predicate: new PredicateField({ required: false }),
                },
                { required: false },
            ),
            { required: true },
        ),
    }),
    effects: new f.ArrayField(effectField, { required: false }),
});
