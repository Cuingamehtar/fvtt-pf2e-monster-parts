import { RuleElementEffectHandler } from "./rule-element";
import { AlterationEffectHandler } from "./alteration";
import { RefinedItem } from "../../refined-item";
import { MaterialEffect } from "../material";

const f = foundry.data.fields;

export const effectField = new f.TypedSchemaField({
    RuleElement: {
        type: new f.StringField({
            choices: ["RuleElement"],
            required: true,
        }),
        levelMin: new f.NumberField({ required: true }),
        levelMax: new f.NumberField({ required: false }),
        rule: new f.ObjectField({ required: true }),
    },
    Alteration: {
        type: new f.StringField({
            choices: ["Alteration"],
            required: true,
        }),
        levelMin: new f.NumberField({ required: true }),
        levelMax: new f.NumberField({ required: false }),
        property: new f.StringField({ required: true }),
        value: new f.NumberField({ required: true }),
    },
});

export class EffectHandlers {
    private static updateHandlers = {
        RuleElement: RuleElementEffectHandler.handleUpdate,
    };

    private static syntheticHandlers = {
        Alteration: AlterationEffectHandler.handleSyntheticData,
    };

    static handleUpdate(
        item: RefinedItem,
        effect: MaterialEffect,
        changes: Record<string, unknown>,
    ) {
        const handler = this.updateHandlers[effect.type];
        if (!handler) return;
        handler(item, effect, changes);
    }

    static handleSynthetic(item: RefinedItem, effect: MaterialEffect) {
        const handler = this.syntheticHandlers[effect.type];
        if (!handler) return;
        handler(item, effect);
    }
}
