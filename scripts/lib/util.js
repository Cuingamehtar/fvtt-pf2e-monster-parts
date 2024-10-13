export const moduleId = "pf2e-monster-parts";

export function t(m, data){
    return data ? game.i18n.format(`${moduleId}.${m}`, data) : game.i18n.localize(`${moduleId}.${m}`);
}

export function returns(value){
    return (_) => value;
}

export function getPartyActors(){
    return game.actors.party.members;
}
