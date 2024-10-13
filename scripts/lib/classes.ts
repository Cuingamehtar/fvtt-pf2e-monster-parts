
export class Imbue {

    constructor(id, itemType, name, req) {
        this.itemType = itemType;
        this.name = name;
        this.req = req;
        this.innerId = id;
    }
    get id() {
        return 'зачарование:' + this.innerId;
    }
}

export class Crafts {
    constructor(id, itemType, name, req) {
        this.itemType = itemType;
        this.name = name;
        this.req = req;
        this.id = id;
    }
}