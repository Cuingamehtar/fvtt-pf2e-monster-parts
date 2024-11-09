export const moduleId = "pf2e-monster-parts";

export function t(m, data) {
    return data ? game.i18n.format(`${moduleId}.${m}`, data) : game.i18n.localize(`${moduleId}.${m}`);
}

export function returns(value) {
    return (_) => value;
}

export function getPartyActors() {
    return game.actors.party.members;
}

export function any(...predicates) {
    return (item) => predicates.some(p => p(item));
}

export function all(...predicates) {
    return (item) => predicates.every(p => p(item));
}

export function forEach(...predicates) {
    return (item) => predicates.forEach(p => p(item));
}