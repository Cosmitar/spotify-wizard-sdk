'use strict';
import Grammar from './SpotifyGrammar';
import QueryParams from './../utils/SpotifyParams';

class Processor {
    constructor() {
        this.getItems = ()=> {};
        this.getPageInfo = ()=> {};
        this.getKey = ()=> {};
    }
}

class QueryBuilder {
    constructor() {

        /**
        * The endpoint query and response grammar instance.
        * @type {Grammar}
        */
        this.grammar = new Grammar();

        /**
        * The operation to perform.
        * @type {string}
        */
        this.operation = '';

        /**
        * Entities collection with order as hierarchy tree.
        * Key -> Value <=> Entity Name -> Entity Id.
        * @type {Map}
        */
        this.entitiesTree = new Map();

        /**
        * Variables on WHERE conditions. Came from QueryParams reducer.
        * @type {QueryParams}
        */
        this.variables = new QueryParams();

        /**
        * Fields tree, usually just one field.
        * @type {Map}
        */
        this.fields = new Set();

        /**
        * Object with pagination information.
        * @type {Object}
        */
        this.limit = { size: 1, offser: 0 }; // should include pagination token?

        /**
        * Key for link the query from grammar and search param objects.
        * @type {string}
        */
        this.queryKey = 'default';

        // CONNECTION params
        this.url = '';
        this.method = '';
        this.payload = {};

        // PROCESSOR - interface methods
        this.processor = new Processor();
    }

    select() {
        this.operation = 'select';
        this.compiler = this.grammar.compileSelect;
        return this;
    }

    insert() {
        this.operation = 'insert';
        this.compiler = this.grammar.compileInsert;
        return this;
    }

    update() {
        this.operation = 'update';
        this.compiler = this.grammar.compileUpdate;
        return this;
    }

    delete() {
        this.operation = 'delete';
        this.compiler = this.grammar.compileDelete;
        return this;
    }

    table(entityName = '', entityValue = null) {
        this.entitiesTree.set(entityName, entityValue);
        return this;
    }

    // alias for TABLE
    from(...params) {
        return this.table(...params);
    }

    into(...params) {
        return this.table(...params);
    }

    field(fieldName) {
        this.fields.add(fieldName);
        return this;
    }

    where(params) {
        this.variables = new QueryParams(params);
        return this;
    }

    limit(size = 1, offset = 0) {
        this.limit = { size, offset };
        return this;
    }

    id(key) {
        this.queryKey = key;
        return this;
    }

    prepare() {
        this.compiler.apply(this.grammar, [this]);
    }

    setInterface(handler) {
        this.lastPreparation = handler;
        /* Object.assign(
            this,*/
        handler.apply(this.grammar, [this]);
        /* ); */
    }
}

export default QueryBuilder;
