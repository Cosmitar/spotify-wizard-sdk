'use strict';
/**
* Flag for avoid multiple instances of Config class
* @type {boolean}
*/
let  singleton = false;

class Creator {
    constructor() {
        this.factories = new Map;
        this.defaultFactory;
    }
    // code...
    defaultFactory(model) {
        this.defaultFactory = model;
    }

    addFactory(key, model) {
        this.factories.set(key.toLowerCase(), model);
    }

    removeFactory(key) {
        this.factories.delete(key);
    }

    make(key = '', data = {}) {
        key = key.toLowerCase();
        if (this.factories.has(key)) {
            return new (this.factories.get(key))(data);
        } else {
            return new this.defaultFactory(data);
        }
    }

    hydrate(data) {
        let collection = [];
        for (let item of data) {
            collection.push(this.make(item.key, item.data));
        }
        return collection;
    }
}

if (!singleton) {
    singleton = new Creator;
}

export default singleton;
