import { materialImbues } from "./lib/imbues.js";
import { armorTypes, materialBulk, materialValue, perceptionValid, skillTypes, weaponTypes } from "./lib/lib.js";

function createRow(label, values) {
    let a = `<tr style="height: 17px;">
            <td style="text-align: left;">${label}</td><td>`
    for (const v of values) {
        a = a + `<p>${v}</p>`
    }
    a = a + `</td></tr>`
    return a;
}

/**
 * 
 * @param {string} header 
 * @param {string} refineLabel 
 * @param {Crafts} refineValues 
 * @param {Imbue} imbueValues 
 * @returns {string}
 */
function createTable(header, refineLabel, refineValues, imbueValues) {
    let a = `<table style="width: 50%;" border="1">
    <tbody>
    <tr style="height: 17px;">
    <td style="height: 17px; text-align: center;" colspan="2"><strong>${header}</strong></td>
    </tr>`
    if (refineValues?.length)
        a = a + createRow(refineLabel, refineValues.map(i => i.name));
    if (imbueValues?.length)
        a = a + createRow("Зачарование", imbueValues.map(i => i.name));
    a = a + `</tbody>
        </table>`;
    return a;
}

async function BZAddMaterials(token, itemId = "Db1YEMQL037mudXd") {
    if (canvas.tokens.controlled.length == 0)
        return;

    let item = game.items.get(itemId).toObject();

    let actor = token.document.actor;

    let bulk = materialBulk(actor);
    let value = materialValue(actor);
    let baseDamageTypes = weaponTypes(actor);
    let baseArmorTypes = await armorTypes(actor);
    let perceptionCraft = perceptionValid(actor);
    let skillCraft = skillTypes(actor);

    let imbues = materialImbues(actor);

    let name = `Добыча (${actor.name}) (${value} зм)`;
    let desc = `<p>Ценность: ${value} зм</p>`;

    // weapons
    let weaponImbues = imbues.filter(i => i.itemType == "weapon");
    if (baseDamageTypes?.length || weaponImbues?.length)
        desc = desc + createTable("Оружие", "Типы урона", baseDamageTypes, weaponImbues);

    let armorImbues = imbues.filter(i => i.itemType == "armor");
    if (armorImbues?.length)
        desc = desc + createTable("Броня", "Типы брони", baseArmorTypes, armorImbues);

    let perceptionImbues = imbues.filter(i => i.itemType == "perception");
    if (perceptionCraft?.length || perceptionImbues?.length)
        desc = desc + createTable("Восприятие", "Крафт", perceptionCraft, perceptionImbues);

    let skillImbues = imbues.filter(i => i.itemType == "skill");
    desc = desc + createTable("Навыки", "Крафт", skillCraft, skillImbues);

    let gmAttributes = baseDamageTypes.concat(baseArmorTypes).concat(perceptionCraft).concat(skillCraft).concat(imbues).map(e => e.id).join(' ');

    item.name = name;
    item.system.description.value = desc;
    item.system.description.gm = gmAttributes;
    item.system.bulk.value = bulk;

    return actor.createEmbeddedDocuments("Item", [item]);
}

Hooks.on("init", () => {
    game.BZLoot = { BZAddMaterials };
})