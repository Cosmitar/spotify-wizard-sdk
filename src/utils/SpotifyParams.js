'use strict';

import QueryParams from './QueryParams';

class SpotifyParams extends QueryParams {
    /**
    * Like a store tree, define all posible parameters for the endpoint.
    * Avoid default values here, set them later on reducers.
    */
    constructor(params = {}) {
        super();
        /**
        * The string to query
        * @note This parameter is used by core to store the query string. Do not remove.
        * @type {string=}
        */
        this.q = params.q;

        /**
        * The CSV ids for several items.
        * @note This parameter is used by core to store the query ids. Do not remove.
        * @type {string=}
        */
        this.ids = params.ids;

        /**
        * The searched entity id
        * @note This parameter is used by core to store the query id. Do not remove.
        * @type {string=|integer}
        */
        this.id = params.id;

        /**
        * A string to send as optional match in the query
        * @type {string=}
        */
        this.or = params.or;

        /**
        * A string to send as exclusion in the query
        * @type {string=}
        */
        this.not = params.not;

        /**
        * Determins if the match of this.q should be exact or not.
        * In case of true, wraps this.q between double quotes.
        * @type {boolean=false}
        */
        this.exactMatch = params.exactMatch; /*|| false;*/
        /**
        * An object representing aditional match attributes.
        * For example: { album: 'gold', year: 2014 }
        * @type {object=null}
        */
        this.filters = params.filters;

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
        this.limit = params.limit;

        /**
        * The initial position to start querying. Just like the SQL OFFSET param.
        * This is a exclusive Pagination param
        * @type {integer=0}
        */
        this.offset = params.offset;

        /**
        * The type of the album: one of "album", "single", or "compilation".
        * @type {string=}
        */
        this.album_type = params.album_type;

        /**
        * A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss.
        * Use this parameter to specify the user's local time to get
        * results tailored for that specific date and time in the day.
        * @type {string=current system timestamp}
        */
        this.timestamp = params.timestamp;

        /**
        * The desired language, consisting of a lowercase ISO 639
        * language code and an uppercase ISO 3166-1 alpha-2 country code, joined by an underscore
        * @type {string='en_US'}
        */
        this.locale = params.locale; /*'en_US';*/

        /**
        * The user's Spotify user ID.
        * @type {string}
        */
        this.user_id = params.user_id;

        /**
        * The last artist ID retrieved from the previous request.
        * @type {string=}
        */
        this.after = params.after;
    }

    // REDUCERS
    getEntity() {
        return {
            market: this.market
        };
    }

    getManyEntities() {
        return {
            ids: this.ids,
            market: this.market
        };
    }

    artistsAlbums() {
        return {
            album_type: this.album_type,
            market: this.market,
            limit: this.limit || 20,
            offset: this.offset || 0
        };
    }

    artistsTopTracks() {
        return {
            country: this.country
        };
    }

    browseFeaturedPlaylists() {
        return {
            locale: this.locale || 'en_US',
            country: this.country || 'US',
            timestamp: this.timestamp || new Date().toISOString(),
            limit: this.limit || 20,
            offset: this.offset || 0
        };
    }

    browseNewReleases() {
        return {
            country: this.country || 'US',
            limit: this.limit || 20,
            offset: this.offset || 0
        };
    }

    browseCategories() {
        return {
            locale: this.locale || 'en_US',
            country: this.country || 'US',
            limit: this.limit || 20,
            offset: this.offset || 0
        };
    }

    browsePlaylistCategory() {
        return {
            country: this.country || 'US',
            limit: this.limit || 20,
            offset: this.offset || 0
        };
    }

    getUserFollowedArtists() {
        return {
            type: this.type,
            limit: this.limit,
            after: this.after
        };
    }

    userFollowActions() {
        return {
            type: this.type,
            ids: this.ids
        };
    }

}

export default SpotifyParams;
