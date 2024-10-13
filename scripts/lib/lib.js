import { sentenceCase } from "./util.js";
import { Crafts } from "./classes.js";

/**
 * @typedef {object} Actor
 * @property {object} system
 */


/**
 * 
 * @param {Actor} actor 
 * @returns {string}
 */
export function materialBulk(actor) {
    let size = actor.system.traits.size.value;

    let bulk = "";
    switch (size) {
        case "tiny":
        case "sm":
            bulk = "L";
            break;
        case "med":
            bulk = "1";
            break;
        case "lg":
            bulk = "2";
        case "huge":
            bulk = "4";
            break;
        case "grg":
            bulk = "8";
            break;
    }
    if (size)
        return bulk;
}

export function materialValue(actor) {
    let level = actor?.system.details.level.value;

    const values = [1.5, 2.25, 3.5, 5, 7, 12, 18, 30, 45, 64, 90, 125, 175, 250, 375, 560, 810, 1250, 1875, 3000, 5000, 8750, 10000, 17500, 20000, 35000, 40000]

    if (level)
        return values[level + 1];
}

export function weaponTypes(actor) {
    let actions = actor?.system.actions;

    const PHYSICAL_DAMAGE = { "piercing": 'колющий', "bludgeoning": 'дробящий', "slashing": 'рубящий' }

    let damageTypes = Array.from(new Set(actions.map(a => a.weapon.baseDamage.damageType)));

    if (damageTypes.length > 0) {
        return Object.keys(PHYSICAL_DAMAGE)
            .filter(d => damageTypes.includes(d))
            .map(k => new Crafts(`оружие:${PHYSICAL_DAMAGE[k]}`, 'weapon', sentenceCase(PHYSICAL_DAMAGE[k]), null));
    }
    return [];
}

export async function armorTypes(actor) {
    const myContent = `
    <div>
    <input type="checkbox" id="light" name="light"/>
    <label for="light">Лёгкий</label>
  </div>
  <div>
    <input type="checkbox" id="medium" name="medium"/>
    <label for="medium">Средний</label>
  </div>
  <div>
    <input type="checkbox" id="heavy" name="heavy"/>
    <label for="heavy">Тяжелый</label>
  </div>
  <div>
    <input type="checkbox" id="shield" name="shield"/>
    <label for="shield">Щит</label>
  </div>
`;

    let armors = { light: false, medium: false, heavy: false, shield: false };

    var outsideResolve;
    var outsideReject;
    let prom = new Promise(function (resolve, reject) {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    function myCallback(html) {
        armors.light = html[0].querySelector("[name='light']").checked;
        armors.medium = html[0].querySelector("[name='medium']").checked;
        armors.heavy = html[0].querySelector("[name='heavy']").checked;
        armors.shield = html[0].querySelector("[name='shield']").checked;
        outsideResolve();
    }
    new Dialog({
        title: "Выберите типы брони",
        content: myContent,
        buttons: {
            button1: {
                label: "Подтвердить",
                callback: (html) => myCallback(html),
                icon: `<i class="fas fa-check"></i>`
            }
        }
    }).render(true);


    await prom;

    let result = []
    if (armors.light)
        result.push(new Crafts('доспех:лёгкий', 'armor', 'Лёгкий', null));
    if (armors.medium)
        result.push(new Crafts('доспех:средний', 'armor', 'Средний', null));
    if (armors.heavy)
        result.push(new Crafts('доспех:тяжёлый', 'armor', 'Тяжёлый', null));
    if (armors.shield)
        result.push(new Crafts('щит', 'armor', 'Щит', null));
    return result;
}

export function perceptionValid(actor) {
    const senses = ["darkvision", "truesight", "scent", "tremorsense", "echolocation", "greater-darkvision", "infrared-vision", "motion-sense", "see-invisibility","wavesense"];
    return senses.some(s => actor.system.perception.senses.map(s=>s.type).includes(s)) ? [new Crafts('восприятие', 'perception', 'Да', null)] : [];
}

function localize(t, prefix = '') {
    let locName = game.i18n.localize(prefix + t);
    if (locName == prefix + t)
        return t;
    return locName;
}

export function skillTypes(actor) {
    return actor.items
        .filter(i => i.type == "lore")
        .map(s => {
            let id = localize(sentenceCase(s.name), 'PF2E.Skill').toLowerCase();
            return new Crafts(
                'навык:' + id,
                'skill',
                sentenceCase(id),
                null)
        });
}