'use strict';
import Grammar from './SpotifyGrammar';

class QueryBuilder extends Grammar {
    constructor() {
        super();
        /*@todo document this parameters*/
        this.operation = 'select';//select|insert|update|remove =>by default GET|PUT|POST|DELETE
        //this.fields = '*';//always
        this.from = '';//main entity
        this.where = {};//var pairs, SearchParams
        this.page = {};//pagination
        //
        this.url = '';
        this.method = this._METHODS[this.operation];
        this.payload;
        //
        this.getItems = ()=> {};
        this.getPageInfo = ()=> {};
        this.getKey = ()=> {};
    }

    get _METHODS() {
        return {select: 'GET', insert: 'PUT', update: 'POST', remove: 'DELETE'};
    }

    update() {
        Object.assign(this, this.lastPreparation());
    }

    prepareEntityQuery() {
        Object.assign(this, super.getEntityQuery());
        this.lastPreparation = super.getEntityQuery;
    }

    prepareManyEntitiesQuery() {
        Object.assign(this, super.getManyEntitiesQuery());
        this.lastPreparation = super.getManyEntitiesQuery;
    }

    prepareSearchQuery() {
        Object.assign(this, super.getSearchQuery());
        this.lastPreparation = super.getSearchQuery;
    }

    prepareQueryByKey() {
        Object.assign(this, super.getQueryByKey());
        this.lastPreparation = super.getQueryByKey;
    }

    prepareWriteEntityQuery() {
        Object.assign(this, super.getWriteEntityQuery());
        this.lastPreparation = super.getWriteEntityQuery;
    }

    prepareWriteQueryByKey() {
        Object.assign(this, super.getWriteQueryByKey());
        this.lastPreparation = super.getWriteQueryByKey;
    }
}

export default QueryBuilder;
