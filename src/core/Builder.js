'use strict';
import QueryBuilder from './QueryBuilder';
import Connection from './../services/Connection';
import Creator from './Creator';
import SearchParams from './../utils/SearchParams';
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
        this.query = new QueryBuilder;
        /**
        * Paginator handler
        * @type {Paginator}
        */
        this.paginator = new Paginator(this);
    }

    getEntity(id = '', config = {}) {
        //this.query.operation = 'select';
        this.query.from = this.model.name.toLowerCase();
        this.query.where = new SearchParams(Object.assign(config, {id}));
        this.query.prepareSelectEntity();
        //next is a single entity response process
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processSingleEntityResponse.bind(this));
    }

    getManyEntities(ids = '', config = {}) {
        //this.query.operation = 'select';
        this.query.from = this.model.groupName;
        this.query.where = new SearchParams(Object.assign(config, {ids}));
        this.query.prepareSelectManyEntities();
        //next is a multiple entities response process
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processMultipleEntitiesResponse.bind(this));
    }

    all(config = {}) {
        this.paginator.configure(config);
        //this.query.operation = 'select';
        this.query.from = this.model.groupName;
        this.query.where = new SearchParams(config);
        this.query.page = this.paginator.getParams();
        this.query.prepareSearch();
        //next is a multiple entities response process
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processMultipleEntitiesResponse.bind(this));
    }

    getByKey(queryKey, config) {
        this.paginator.configure(config);
        this.query.from = this.model.groupName;
        this.query.where = new SearchParams(Object.assign(config, {queryKey}));
        this.query.page = this.paginator.getParams();
        this.query.prepareSelectByKey();
        return this.queryEndpoint(this.query.url, this.query.method)
            .then((response)=> {
                return this.query.getItems(response).constructor === Array
                    ? this._processMultipleEntitiesResponse(response)
                    : this._processSingleEntityResponse(response);
            });
    }

    insertByKey(queryKey, config) {
        this.paginator.configure(config);
        this.query.from = this.model.groupName;
        this.query.where = new SearchParams(Object.assign(config, {queryKey}));
        this.query.page = this.paginator.getParams();
        this.query.prepareInsertByKey();
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processMultipleEntitiesResponse.bind(this));
    }

    updateByKey(queryKey, config) {
        this.paginator.configure(config);
        this.query.to = this.model.groupName;
        this.query.where = new SearchParams(Object.assign(config, {queryKey}));
        this.query.page = this.paginator.getParams();
        this.query.prepareUpdateByKey();
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processMultipleEntitiesResponse.bind(this));
    }

    removeByKey(queryKey, config) {
        this.paginator.configure(config);
        this.query.to = this.model.groupName;
        this.query.where = new SearchParams(Object.assign(config, {queryKey}));
        this.query.page = this.paginator.getParams();
        this.query.prepareRemoveByKey();
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processMultipleEntitiesResponse.bind(this));
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
        let pageInfo = this.query.getPageInfo(response);
        let items = this.query.getItems(response);
        let collection = !items
            ? response
            : Creator.hydrate(items.map(data => {
                return { key: this.query.getKey(data), data };
            }));
        let retVal = collection;
        //update paginator
        if (pageInfo) {
            this.paginator.update(pageInfo);
            this.paginator.setPage(collection);
            retVal = this.paginator;
        }
        return retVal;
    }

    _processSingleEntityResponse(response) {
        let item = this.query.getItems(response);
        let key = this.query.getKey(item);
        return Creator.make(key, item);
    }

    paginate() {
        this.query.page = this.paginator.getParams();
        this.query.update();
        return this.queryEndpoint(this.query.url, this.query.method)
            .then(this._processMultipleEntitiesResponse.bind(this));
    }

    queryEndpoint(url, method='GET', payload={}) {
        return Connection.request(url, method, payload);
    }

}

export default Builder;
