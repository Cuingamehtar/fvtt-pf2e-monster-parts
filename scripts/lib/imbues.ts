import { Imbue } from "./classes.js";
import { t, sentenceCase } from './util.js';

const CREATURE_TYPES = ["aberration", "animal", "astral", "beast", "celestial", "construct", "dragon", "dream", "elemental", "ethereal", "fey", "fiend", "giant", "monitor", "negative", "ooze", "positive", "spirit", "time"]
const ENERGY_TYPES = ["acid", "cold", "electricity", "fire", "force", "positive", "sonic"]

const hasTrait = ({ actor, type }) => actor.system.traits.value.includes(type);
const hasDamageType = ({ actor, type }) => actor.system.actions.some(a => a.weapon.baseDamage.damageType == type);
const hasActionTrait = ({ actor, type }) => actor._itemTypes.action.some(a => a.system.traits.value.includes(type))
const hasResistance = ({ actor, type }) => actor.system.attributes.resistances.some(r => r.type == type)
const hasImmunity = ({ actor, type }) => actor.system.attributes.immunities.some(r => r.type == type)

const hasAny = ({ actor, delegate, types }) => types.some(t => delegate({ actor: actor, type: t }))

const occursin = (b, a) => a.includes(b.toLowerCase());

function imbueDamage(type) {
    let id = t(type);
    return new Imbue('оружие:' + id, 'weapon', sentenceCase(id), (a) => hasTrait({ actor: a, type: type }) || hasDamageType({ actor: a, type: type }) || hasActionTrait({ actor: a, type: type })
    );
}

const getSenses = (a) => a.system.perception.senses.map(s=>s.type);
function imbueSensory() {
    return [new Imbue('чувства:6',
        'perception',
        'Чувства (1-6)',
        (a) => occursin('low-light-vision', getSenses(a))),
    new Imbue('чувства:12',
        'perception',
        'Чувства (6-12)',
        (a) => occursin('darkvision', getSenses(a))),
    new Imbue('чувства:16',
        'perception',
        'Чувства (12-16)',
        (a) => occursin('scent', getSenses(a))),
    new Imbue('чувства:18',
        'perception',
        'Чувства (16-18)',
        (a) => occursin('greater-darkvision', getSenses(a))),
    new Imbue('чувства:20',
        'perception',
        'Чувства (18-20)',
        (a) => occursin('truesight', getSenses(a)))
    ]
}

export function materialImbues(actor) {

    const imbueBane = () => CREATURE_TYPES.map(c =>
        new Imbue(`оружие:бич:${t(c)}`, 'weapon', `Бич (${t(c)})`, (a) => hasTrait({ actor: a, type: c }))
    )

    const imbueEnergyResistant = () => ENERGY_TYPES.map(r =>
        new Imbue(`доспех:сопротивление:${t(r)}`, 'armor', `Сопротивление (${t(r)})`, (a) => hasResistance({ actor: a, type: r }))
    )

    const imbueAttributes = (actor) => {
        let ab = actor.system.abilities;
        let abil = [{ "name": "str", "value": ab.str.value, fullName: "strength" },
        { "name": "dex", "value": ab.dex.value, fullName: "dexterity" },
        { "name": "con", "value": ab.con.value, fullName: "constitution" },
        { "name": "int", "value": ab.int.value, fullName: "intelligence" },
        { "name": "wis", "value": ab.wis.value, fullName: "wisdom" },
        { "name": "cha", "value": ab.cha.value, fullName: "charisma" }];
        abil.sort((a, b) => b.value - a.value);
        return abil.slice(0, 2).map(v =>
            new Imbue(`характеристика:${t(v.fullName)}`, 'skill', sentenceCase(t(v.fullName)), () => true)
        );
    }

    let imbues = [
        imbueDamage("acid"),
        imbueDamage("chaotic"),
        imbueDamage("cold"),
        imbueDamage("electricity"),
        imbueDamage("evil"),
        imbueDamage("fire"),
        imbueDamage("force"),
        new Imbue(`доспех:укрепление`,
            'armor',
            'Укрепление',
            (a) => hasAny({ actor: a, delegate: hasResistance, types: ["precision", "critical-hits"] }) || hasAny({ actor: a, delegate: hasImmunity, types: ["precision", "critical-hits"] })),
        imbueDamage("good"),
        imbueDamage("lawful"),
        new Imbue(`оружие:ментальный`,
            'weapon',
            'Ментальный',
            (a) => hasAny({ actor: a, delegate: hasTrait, types: ["astral", "mental"] }) || hasAny({ actor: a, delegate: hasDamageType, types: ["astral", "mental"] })),
        new Imbue('оружие:пустота',
            'weapon',
            'Пустота',
            (a) => hasAny({ actor: a, delegate: hasTrait, types: ["negative", "undead"] }) || hasAny({ actor: a, delegate: hasDamageType, types: ["negative", "undead"] })),
        imbueDamage("poison"),
        imbueDamage("positive"),
        imbueDamage("sonic"),
        // SPELL
        // NEEDS HARDNESS TOO
        new Imbue('щит:прочный',
            'armor',
            'Прочный (щит)',
            (a) => hasAny({ actor: a, delegate: hasResistance, types: ["physical", "piercing", "bludgeoning", "slashing"] })),
        new Imbue('оружие:дикий', 'weapon', 'Дикий', (_) => true),
        new Imbue('доспех:крылатый', 'armor', 'Крылатый', (a) => a.system.attributes.speed.type == "fly" || a.system.attributes.speed.otherSpeeds.some(s => s.type == "fly"))
    ]
    imbues.push(...imbueBane());
    imbues.push(...imbueEnergyResistant());
    imbues.push(...imbueAttributes(actor));
    imbues.push(...imbueSensory());

    const imbs = (a) => imbues.filter(i => i.req(a)).sort((a, b) => a.name.localeCompare(b.name));
    let res = imbs(actor);
    return res;
}