const fields = foundry.data.fields;

const keyModel = new fields.StringField({
    blank: false,
    nullable: false,
    required: true,
});

const labelModel = new fields.StringField({
    blank: false,
    nullable: false,
    required: true,
});

const descriptionModel = new fields.StringField({
    blank: true,
    required: false,
});

export const materialDataSchema = new fields.SchemaField({
    key: keyModel,
    label: labelModel,
    description: descriptionModel,
});

type A = FromDataModel<typeof materialDataSchema>;
