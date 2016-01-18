'use strict';
import Creator from './Creator';
import Builder from './Builder';

class StaticModel {
    /**
    * Identifies the plural name of the item.
    * Similar to table name in ORM
    */
    static get groupName() {
        return '';
    }

    /**
    * Identifies the name of the item.
    * References to an entity.
    */
    static get singleName() {
        return this.name;
    }

    /**
    * Protect attributes from mass assigment.
    * @return {Array<string>} The names of the attributes not overwritten by mass assigment.
    */
    static getNotFillable() {
        return [];
    }

    /**
    * Finds an entity by its primary key
    * @param {string} id Endpoint ID.
    * @return {Promise}
    */
    static find(id, config = {}) {
        let builder = new Builder(this);
        return builder.getEntity(id, config);
    }

    /**
    * Finds several entities by their primary key
    * @param {string} id Endpoint ID.
    * @return {Promise}
    */
    static findMany(ids, config = {}) {
        let builder = new Builder(this);
        return builder.getManyEntities(ids, config);
    }

    /**
    * Starts a query with the given parameter.
    * @queryString {string} queryString A string to find by q parameter
    * @params {object} params A plain object with advanced search options
    * @return {Promise}
    */
    static where(queryString, params = {}) {
        let builder = new Builder(this);
        // builder.relation = 'search';//search,artist-top-track,artist-albums
        // builder.config = params;
        // builder.factory = this;
        return builder.all(Object.assign(params, { q: queryString }));
    }
}

class ConcreteModel extends StaticModel {

    constructor(data = {}) {
        super();
        /**
        * Flag if model is a simplified object or not.
        * @type {boolean}
        * @see https://developer.spotify.com/web-api/endpoint-reference/
        */
        this.simplified = true;

        /**
        * Data object as it is received from api.
        * @var {object} Endpoint json parsed
        */
        this.original = data;

        this._massAssign(data);
    }

    /**
    * Mass assign attributes. Excludes attributes marked as NOT FILLABLE
    * @param {object} data The json parsed endpoint response.
    */
    _massAssign(data) {
        let notFillable = this.constructor.getNotFillable() || [];
        for (let el in data) {
            if (notFillable.indexOf(el) === -1 && typeof this[ el ] !== 'function') {
                this[ el ] = data[ el ];
            }
        }
    }
}
Creator.defaultFactory(ConcreteModel);

export { StaticModel };
export default ConcreteModel;
