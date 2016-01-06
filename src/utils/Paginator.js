'use strict';

/**
* Paginator should solve the logic for paginate results.
* Its attributes and some logic changes accross different APIs but must try to mantein
* certain consistency to outside the class.
* Some times the current page index or size of the page is returned by API, some othres
* should calculate in order to offer same interface methods
* This class should have a reply about the current page results:
*  - how many elements are there in current response. Page size based on LIMIT concept.
*  - the number of the current page. Based on OFFSET concept.
*  - the total of elements for the quert, beside this page.
*  - the total of pages for the query.
*
* Should offer access to the current page elements with some shortcuts as:
*  - first element
*  - last element
*  - element at position
*
* Should handle the queries for Next Page, Prev Page and Go To Page actions.
* When paginate, this class should use the current Engine instance wich contains the search params,
* and run again the query after update the OFFSET. In case of Page Token APIs is simpliest but must
* solve the propper token for the next query.
*
* Since this class hasn't static methods, the object should expose a method to be updated
* after each query.
* As this class ignores what happend outside, this class is updated by its owner, passing the page
* info recieved from endpoint, thus this class must undertand the structor of the page information
* of the response.
*
* Optional, this class can store pages in memory to cache results and improve performance on future
* pagination actions.
*/

class Paginator {
    constructor(browser) {
        /**
        * The amount of results per query. Just like the SQL LIMIT param.
        * @type {integer=}
        */
        this._limit = Paginator.LIMIT_DEFAULT;

        /**
        * The initial position to start querying. Just like the SQL OFFSET param.
        * @type {integer=}
        */
        this._offset = Paginator.OFFSET_DEFAULT;

        /**
        * The total amount of pages for the query. Some times retrieved by API other
        * ones calculated by Paginator.
        * @type {integer=0}
        */
        this._total_pages = 0;

        /**
        * The total amount of matching elements for the query. Usually bigger than page size.
        * @type {integer=0}
        */
        this._total_results = 0;

        /**
        * The page number for the current result. The page number starts in 1.
        * The page 0 doesn't exist.
        * First page correspond to offset 0.
        * @type {integer=1}
        */
        this._currentIndex = 1;

        /**
        * Elements collection representing the current page content.
        * @type {Array<object>}
        */
        this._currentPage = [];

        /**
        * Store for previously retrieved pages.
        * @type {Array<object>}
        */
        this._pagesCache = [];

        this._browser = browser;
    }

    /**
    * Getters for private vars
    */
    get elements() { return this._currentPage; }
    get limit() { return this._limit; }
    get offset() { return this._offset; }
    get total_pages() { return this._total_pages; }
    get currentIndex() { return this._currentIndex; }
    get page_size() { return this._limit; }

    /**
    * Entablish a link to the composition owner.
    * @param {Engine} value The Owner
    */
    set browser(value) {
        this._browser = value;
    }

    /**
    * Updates internal page info data based on the given one by parameter.
    * Usually the pagination info given by endpoint.
    * @param {object} data Plain data object
    */
    update(data = {}) {
        this._offset = data.offset || this._offset;
        this._limit = data.limit || this._limit;
        this._total_results = data.total || this._total_results;
        //offset can be 0 but index starts in 1
        this._currentIndex = data.current_page || (this._offset / this._limit) + 1;
        this._total_pages = data.total_pages || Math.ceil(this._total_results / this._limit);
    }

    /**
    * Exposes a method to update current page elements.
    * This method is splitted of update becaouse instead of recieve
    * plain objects returned by endpoint.
    * at this time the items to store are entities for the SDk.
    * Ignoring the class, this method stores the items.
    * @param {Array<object>} items The entitiy objects for the current page.
    */
    setPage(items) {
        this._currentPage = items;
    }

    /**
    * Returns the first element of the resultset
    * @return {object} An entity object from the first position of the current page
    */
    firstElement() {
        return this._currentPage[0];
    }

    /**
    * Returns the last element of the resultset
    * @return {object} An entity object from the last position of the current page
    */
    lastElement() {
        return this._currentPage[this._currentPage.length - 1];
    }

    /**
    * Returns an element of the resultset for the position index given by parameter.
    * @param {integer} index The position index
    * @return {object} An entity object from certain position of the current page
    * @TODO validate existance of the given index
    */
    elementAt(index) {
        return this._currentPage[index];
    }

    /**
    * Checks if there is next page. Sometimes performing calculations and
    * others based on next page token.
    * @return {boolean}
    */
    hasNextPage() { return this._currentIndex < this._total_pages; };

    /**
    * Checks if there is previous page. Sometimes performing calculations and
    * others based on prev page token.
    * @return {boolean}
    */
    hasPrevPage() { return this._currentIndex > 1; }

    /**
    * Handles the next page process. Validate, set the parameter for next page and
    * ask to owner to query again.
    * On resolve...
    * @return {Promise}
    */
    nextPage() {
        let retVal = new Promise((resolve,reject) => {
            if (this.hasNextPage()) {
                this._offset = this._limit * this._currentIndex;
                resolve(this._browser.paginate());
            } else {
                reject(null);
            }
        });
        return retVal;
    }
    prevPage() {
        let retVal = new Promise((resolve,reject) => {
            if (this.hasPrevPage()) {
                this._offset = this._limit * (this._currentIndex - 1);
                resolve(this._browser.paginate());
            } else {
                reject(null);
            }
        });
        return retVal;
    }
    firstPage() {
        let retVal = new Promise((resolve,reject) => {
            this._offset = 0;
            resolve(this._browser.paginate());
        });
        return retVal;
    }
    lastPage() {
        let retVal = new Promise((resolve,reject) => {
            this._offset = this._total_pages * this._limit - this._limit;
            resolve(this._browser.paginate());
        });
        return retVal;
    }
    goToPage(index) {
        let retVal = new Promise((resolve,reject) => {
            this._offset = this._limit * index - 1;
            resolve(this._browser.paginate());
        });
        return retVal;
    }
    //maybe an API custom method
    configure(config) {
        this._limit = config.limit || this._limit;
        this._offset = config.offset || this._offset;
    }

    getParams() {
        return {
            limit: this._limit,
            offset: this._offset
        };
    }
}

Paginator.LIMIT_DEFAULT = 50;
Paginator.OFFSET_DEFAULT = 0;

export default Paginator;
