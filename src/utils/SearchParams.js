'use strict';
/**
* SearchParams should contain the aditional parametes for queries.
* Should apply the logic realted to parameters.
* Could have setters and gettes
* Could group the pareameters based on queries needs
* Commonly this class is used by Engine or other internal class to create an object,
* The developer will tipically pass a text plain object to o class wich will create
* a SearchParams object with that.
*/
class SpotifyParams {
    constructor(params = {}) {
        /**
        * The string to query
        * @note This parameter is used by core to store the query string. Do not remove.
        * @type {string=}
        */
        this.q = params.q || '';

        /**
        * The CSV ids for several items.
        * @note This parameter is used by core to store the query ids. Do not remove.
        * @type {string=}
        */
        this.ids = params.ids || [];

        /**
        * The searched entity id
        * @note This parameter is used by core to store the query id. Do not remove.
        * @type {string=|integer}
        */
        this.id = params.id;

        /**
        * The custom key to handle non standard queries
        * @note This parameter is used by core to store the query key. Do not remove.
        * @type {string=|integer}
        */
        this.queryKey = params.queryKey;

        /**
        * A string to send as optional match in the query
        * @type {string=}
        */
        this.or = params.or || '';

        /**
        * A string to send as exclusion in the query
        * @type {string=}
        */
        this.not = params.not || '';

        /**
        * Determins if the match of this.q should be exact or not.
        * In case of true, wraps this.q between double quotes.
        * @type {boolean=false}
        */
        this.exactMatch = params.exactMatch || false;
        /**
        * An object representing aditional match attributes.
        * For example: { album: 'gold', year: 2014 }
        * @type {object=null}
        */
        this.filters = params.filters || null;

        /**
        * The country letters (an ISO 3166-1 alpha-2 country code).
        * @type {string=}
        */
        this.market = params.market;

        /**
        * The country letters (an ISO 3166-1 alpha-2 country code).
        * @type {string=}
        */
        this.country = params.country;

        /**
        * The type of the entity or entities: album, artist, playlist, and track.
        * @type {string=}
        */
        this.type = params.type;

        /**
        * The amount of results per query. Just like the SQL LIMIT param.
        * This is a exclusive Pagination param
        * @type {integer=50}
        */
        this.limit = params.limit || 50;

        /**
        * The initial position to start querying. Just like the SQL OFFSET param.
        * This is a exclusive Pagination param
        * @type {integer=0}
        */
        this.offset = params.offset || 0;

        /**
        * The type of the album: one of "album", "single", or "compilation".
        * @type {string=}
        */
        this.album_type = params.album_type || '';

        /**
        * A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss.
        * Use this parameter to specify the user's local time to get
        * results tailored for that specific date and time in the day.
        * @type {string=current system timestamp}
        */
        this.timestamp = params.timestamp || new Date().getTime();

        /**
        * The desired language, consisting of a lowercase ISO 639
        * language code and an uppercase ISO 3166-1 alpha-2 country code, joined by an underscore
        * @type {string='en_US'}
        */
        this.locale = params.locale || 'en_US';
    }
}
//@NOTE here can use reducers to retrieve proper parameters for different requests.
export default SpotifyParams;
