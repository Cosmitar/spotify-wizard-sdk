'use strict';

class SpotifyGrammar {
    /**
    *
    */
    getSelectEntity(params) {
        let url = `/${ params.from }/${ params.where.id }`;
        let getItems = (response) => { return response; };
        let getKey = (item) => { return item.type; };
        return { url, getItems, getKey };
    }

    getSelectManyEntities(params) {
        let url = `/${ params.from }/?ids=${ params.where.ids.join(',') }`;
        if (params.where.market) {
            url += `&market=${ params.where.market }`;
        }
        let getItems = (response) => { return response[params.from]; };
        let getKey = (item) => { return item.type; };
        return { url, getItems, getKey };
    }

    getSearch(params) {
        //Q & EXACT MATCH
        let q = params.where.exactMatch ? `"${ params.where.q }"` : params.where.q;
        //OR
        if (params.where.or != '') {
            q += escape(` OR ${params.where.or}`);
        }
        //NOT
        if (params.where.not != '') {
            q += escape(` NOT ${params.where.not}`);
        }
        //FILTERS
        if (params.where.filters) {
            q += q != '' ? '%20' : '';

            function objectEntries(obj) {
                let index = 0;
                let propKeys = Object.getOwnPropertyNames(obj).concat(
                    Object.getOwnPropertySymbols(obj)
                );

                return {
                    [Symbol.iterator](params) {
                        return this;
                    },
                    next(params) {
                        if (index < propKeys.length) {
                            let key = propKeys[index];
                            index++;
                            return { value: [key, obj[key]] };
                        } else {
                            return { done: true };
                        }
                    }
                };
            }
            let pairs = [];
            for (let [key, value] of objectEntries(params.where.filters)) {
                pairs.push(`${key}:${escape(value)}`);
            }
            q += pairs.join('%20');
        }

        //MARKET, TYPE, LIMIT AND OFFSET
        let url = `/search?q=${ q }` +
            (params.where.market ? `&market=${params.where.market}` : '') +
            `&type=${ params.where.type }` +
            `&limit=${ params.page.limit }` +
            `&offset=${ params.page.offset }`;

        let getItems = (response) => { return response[params.from].items; };
        let getPageInfo = (response) => { return response[params.from]; };
        let getKey = (item) => { return item.type; };
        return { url, getItems, getPageInfo, getKey };
    }

    /**
    * Helper to convert this-func-name into thisFuncName.
    */
    _key2Method(key = '') {
        return key.split('-').map((item, index)=> {
            return index > 0
                ? item.charAt(0).toUpperCase() + item.slice(1)
                : item;
        }).join('');
    }

    /**
    * Alias of getSelectByKey because same behavior
    */
    getInsertByKey(params) { return this.getSelectByKey(params); }
    getRemoveByKey(params) { return this.getSelectByKey(params); }

    getSelectByKey(params) {
        let grammarResponse = {
            url: '',
            getItems: ()=> {},
            getPageInfo: ()=> {},
            getKey: (item)=> { return item.type; }//default for most of Spotify responses
        };
        let method = this._key2Method(params.where.queryKey);
        if (typeof this[method] === 'function') {
            grammarResponse = this[method](grammarResponse, params);
        }
        return grammarResponse;
    }

    playlist(grammar, params) {
        grammar.url = `/users/${ params.where.user_id }` +
            `/${ params.from }/${ params.where.id }`;
        grammar.getItems = (response) => { return response; };
        return grammar;
    }

    followPlaylist(grammar, params) {
        grammar.url = `/users/${ params.where.user_id }` +
            `/${ params.from }/${ params.where.id }` +
            `/followers`;
        return grammar;
    }

    artistsTopTracks(grammar, params) {
        grammar.url = `/${ params.from }/${ params.where.id }` +
            `/top-tracks?country=${ params.where.market }`;
        grammar.getItems = (response) => { return response.tracks; };
        return grammar;
    }

    artistsAlbums(grammar, params) {
        grammar.url = `/${ params.from }/${ params.where.id }` +
            `/albums?` +
            `country=${ params.where.market }` +
            `&limit=${ params.page.limit }` +
            `&offset=${ params.page.offset }`;
        grammar.getItems = (response) => { return response.items; };
        grammar.getPageInfo = (response) => { return response; };
        return grammar;
    }

    savedTracks(grammar, params) {
        grammar.url = `/${ params.from }/tracks?` +
            `country=${ params.where.market }` +
            `&limit=${ params.page.limit }` +
            `&offset=${ params.page.offset }`;
        grammar.getItems = (response) => { return response.items; };
        grammar.getPageInfo = (response) => { return response; };
        grammar.getKey = (item) => { return 'tracks'; };
        return grammar;
    }

    relatedArtists(grammar, params) {
        grammar.url = `/${ params.from }/${ params.where.id }` +
            `/related-artists`;
        grammar.getItems = (response) => { return response[params.from]; };
    }

    //browse methods
    featuredPlaylists(grammar, params) {
        grammar.url = `/${ params.from }/${ params.where.queryKey }`;
        grammar.getItems = (response) => { return response[params.where.type].items; };
        grammar.getPageInfo = (response) => { return response[params.where.type]; };
        return grammar;
    }

    newReleases(grammar, params) {
        //same behavior than featuredPlaylists
        grammar.url = `/${ params.from }/${ params.where.queryKey }`;
        grammar.getItems = (response) => { return response[params.where.type].items; };
        grammar.getPageInfo = (response) => { return response[params.where.type]; };
        return grammar;
    }

    categories(grammar, params) {
        grammar.url = `/${ params.from }/${ params.where.queryKey }`;
        grammar.getItems = (response) => { return response[params.where.type].items; };
        grammar.getPageInfo = (response) => { return response[params.where.type]; };
        grammar.getKey = (item) => { return 'category'; };
        return grammar;
    }

    getCategorysPlaylists(grammar, params) {
        grammar.url = `/${ params.from }/categories/${ params.where.id }/playlists`;
        grammar.getItems = (response) => { return response[params.where.type].items; };
        grammar.getPageInfo = (response) => { return response[params.where.type]; };
        return grammar;
    }

    // profile methods
    following(grammar, params) {
        grammar.url = `/${ params.from }/following/?` +
            `type=${ params.where.type }`;
        grammar.getItems = (response) => { return response.artists.items; };
        grammar.getPageInfo = (response) => { return response.artists; };
        return grammar;
    }

    follow(grammar, params) {
        grammar.url = `/${ params.from }/following/?` +
            `type=${ params.where.type.toLowerCase() }&ids=${ params.where.ids }`;
        return grammar;
    }

    unfollow(grammar, params) {
        grammar.url = `/${ params.from }/following/?` +
            `type=${ params.where.type.toLowerCase() }&ids=${ params.where.ids }`;
        return grammar;
    }

    isFollowing(grammar, params) {
        grammar.url = `/${ params.from }/following/contains?` +
            `type=${ params.where.type.toLowerCase() }&ids=${ params.where.ids }`;
        return grammar;
    }

    template(grammar, params) {
        return grammar;
    }
}

export default SpotifyGrammar;
