'use strict';
/**
* QueryParams represents a store tree containing all endpoint possible params.
* Reducers will select proper varaibles based on query key.
*/
class QueryParams {

    /**
    * Reduces variables to return specific set to QueryBuilder.
    * @param {string} method Name of the method to call. It's related to query key.
    *   @see ...
    * @return {Object} Set of relevant variables.
    */
    reduce(method) {
        let retVal = {};
        if (typeof this[method] === 'function') {
            retVal = this[method]();
        }
        let mapEntries = (obj)=> {
            let varsMap = new Map();
            Object.keys(obj).map((k) => varsMap.set(k, obj[k]));
            return varsMap;
        };
        return mapEntries(retVal);
    }

}

export default QueryParams;
