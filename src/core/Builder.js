'use strict';
import QueryBuilder from './QueryBuilder';
import Connection from './../services/Connection';
import Creator from './Creator';
import Paginator from './../utils/Paginator';

class Builder {
    // code...
    constructor(model) {
        /**
        * @type {ConcreteModel}
        */
        this.model = model;
        /**
        * @type {QueryBuilder}
        */
        this.query = new QueryBuilder();
        /**
        * Paginator handler
        * @type {Paginator}
        */
        this.paginator = new Paginator(this);
    }

    getEntity(id = '', config = {}) {
        this.query
            .id('get-entity')
            .select()
            .from(this.model.groupName, id)
            .where(Object.assign(config, { id }))
            .prepare();
        return this.runQuery(this.query);
        /*  .then(this._processSingleEntityResponse.bind(this));*/
    }

    getManyEntities(ids = '', config = {}) {
        this.query
            .id('get-many-entities')
            .select()
            .from(this.model.groupName)
            .where(Object.assign(config, { ids }))
            .prepare();
        return this.runQuery(this.query);
        /*  return this.queryEndpoint(this.query.url, this.query.method)
                .then(this._processMultipleEntitiesResponse.bind(this));*/
    }

    queryRaw(expression = '') {
        // should run a given url, for example on NEXT in pagination
        return expression;
    }

    runQuery(query) {
        return this.queryEndpoint(query.url, query.method)
            .then((response)=> {
                let items = this.query.processor.getItems(response);
                return items && items.constructor === Array
                    ? this._processMultipleEntitiesResponse(response)
                    : this._processSingleEntityResponse(response);
            });
    }

    _getEntity(id = '', config = {}) {
        //this.query.operation = 'select';
        this.query.from = this.model.name.toLowerCase();
        this.query.where = new QueryParams(Object.assign(config, {id}));
        this.query.prepareSelectEntity();
        //next is a single entity response process
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processSingleEntityResponse.bind(this));
    }

    _getManyEntities(ids = '', config = {}) {
        //this.query.operation = 'select';
        this.query.from = this.model.groupName;
        this.query.where = new QueryParams(Object.assign(config, {ids}));
        this.query.prepareSelectManyEntities();
        //next is a multiple entities response process
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processMultipleEntitiesResponse.bind(this));
    }

    all(config = {}) {
        this.paginator.configure(config);
        this.query
            .select()
            .from(this.model.groupName)
            .where(config)
            .limit(...this.paginator.getParams())
            .prepare();
        return this.runQuery(this.query);
    }

    /**
    * In order to process response, this code depends on 3 helper functions:
    *  getPageInfo: return pagination info from response.
    *  getItems: return entities from response.
    *  getKey: return the element key from the response. The key is sent to Creator for
    *    getting the class to build for given entity
    * Three functions are defined on Grammar object because they are
    *  specific to the endpoint response.
    */
    _processMultipleEntitiesResponse(response) {
        let pageInfo = this.query.processor.getPageInfo(response);
        let items = this.query.processor.getItems(response);
        let collection = !items
            ? response
            : this.constructor.hydrate(
                items,
                this.query.processor.getKey
            );
        let retVal = collection;
        // update paginator
        if (pageInfo) {
            this.paginator.update(pageInfo);
            this.paginator.setPage(collection);
            retVal = this.paginator;
        }
        return retVal;
    }

    _processSingleEntityResponse(response) {
        let item = this.query.processor.getItems(response);
        let key = item ? this.query.processor.getKey(item) : '';
        return item
            ? Creator.make(key, item)
            : response;
    }

    static hydrate(itemsCollection = [], getKey = ()=> {}) {
        return Creator.hydrate(itemsCollection.map(data => {
            return { key: getKey(data), data };
        }));
    }

    /**
    * External method to run a query with internal data.
    @todo improve this method name
    */
    build() {
        this.query.prepare();
        return this.runQuery(this.query);
    }

    paginate() {
        this.query.page = this.paginator.getParams();
        this.query.update();
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processMultipleEntitiesResponse.bind(this));
    }

    queryEndpoint(url, method = 'GET', payload = {}) {
        return Connection.request(url, method, payload);
    }

}

export default Builder;
