'use strict';
import Grammar from './SpotifyGrammar';

class QueryBuilder {
    constructor() {
        //super();
        this.grammar = new Grammar;
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
        //interface methods
        this.getItems = ()=> {};
        this.getPageInfo = ()=> {};
        this.getKey = ()=> {};
    }

    get _METHODS() {
        return {select: 'GET', insert: 'PUT', update: 'POST', remove: 'DELETE'};
    }

    update() {
        getInterface(this.lastPreparation);
    }

    getGrammarParams() {
        return {
            from: this.from,
            where: this.where,
            page: this.page
        };
    }

    setInterface(handler) {
        this.lastPreparation = handler;
        Object.assign(
            this,
            handler.apply(this.grammar, [this.getGrammarParams()])
        );
    }

    prepareSearch() {
        this.method = this._METHODS.select;
        this.setInterface(this.grammar.getSearch);
    }

    prepareSelectEntity() {
        this.method = this._METHODS.select;
        this.setInterface(this.grammar.getSelectEntity);
    }

    prepareInsertEntity() {
        this.method = this._METHODS.insert;
        this.setInterface(this.grammar.getWriteEntityQuery);
    }

    prepareUpdateEntity() {
        this.method = this._METHODS.update;
        this.setInterface(this.grammar.getUpdateEntity);
    }

    prepareRemoveEntity() {
        this.method = this._METHODS.remove;
        this.setInterface(this.grammar.getRemoveEntity);
    }

    prepareSelectManyEntities() {
        this.method = this._METHODS.select;
        this.setInterface(this.grammar.getSelectManyEntities);
    }

    prepareInsertManyEntities() {
        this.method = this._METHODS.insert;
        this.setInterface(this.grammar.getInsertManyEntities);
    }

    prepareUpdateManyEntities() {
        this.method = this._METHODS.update;
        this.setInterface(this.grammar.getUpdateManyEntities);
    }

    prepareRemoveManyEntities() {
        this.method = this._METHODS.remove;
        this.setInterface(this.grammar.getRemoveManyEntities);
    }

    prepareSelectByKey() {
        this.method = this._METHODS.select;
        this.setInterface(this.grammar.getSelectByKey);
    }

    prepareInsertByKey() {
        this.method = this._METHODS.insert;
        this.setInterface(this.grammar.getInsertByKey);
    }

    prepareUpdateByKey() {
        this.method = this._METHODS.update;
        this.setInterface(this.grammar.getUpdateByKey);
    }

    prepareRemoveByKey() {
        this.method = this._METHODS.remove;
        this.setInterface(this.grammar.getRemoveByKey);
    }
}

export default QueryBuilder;
