'use strict';

class SpotifyGrammar {
    /**
    *
    */
    getEntityQuery() {
        let url = `/${ this.from }/${ this.where.id }`;
        let getItems = (response) => { return response; };
        let getKey = (item) => { return item.type; };
        return { url, getItems, getKey };
    }

    getManyEntitiesQuery() {
        let url = `/${ this.from }/?ids=${ this.where.ids.join(',') }`;
        if (this.where.market) {
            url += `&market=${ this.where.market }`;
        }
        let getItems = (response) => { return response[this.from]; };
        let getKey = (item) => { return item.type; };
        return { url, getItems, getKey };
    }

    getSearchQuery() {
        //Q & EXACT MATCH
        let q = this.where.exactMatch ? `"${ this.where.q }"` : this.where.q;
        //OR
        if (this.where.or != '') {
            q += escape(` OR ${this.where.or}`);
        }
        //NOT
        if (this.where.not != '') {
            q += escape(` NOT ${this.where.not}`);
        }
        //FILTERS
        if (this.where.filters) {
            q += q != '' ? '%20' : '';

            function objectEntries(obj) {
                let index = 0;
                let propKeys = Object.getOwnPropertyNames(obj).concat(
                    Object.getOwnPropertySymbols(obj)
                );

                return {
                    [Symbol.iterator]() {
                        return this;
                    },
                    next() {
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
            for (let [key, value] of objectEntries(this.where.filters)) {
                pairs.push(`${key}:${escape(value)}`);
            }
            q += pairs.join('%20');
        }

        //MARKET, TYPE, LIMIT AND OFFSET
        let url = `/search?q=${ q }` +
            (this.where.market ? `&market=${this.where.market}` : '') +
            `&type=${ this.where.type }` +
            `&limit=${ this.page.limit }` +
            `&offset=${ this.page.offset }`;

        let getItems = (response) => { return response[this.from].items; };
        let getPageInfo = (response) => { return response[this.from]; };
        let getKey = (item) => { return item.type; };
        return { url, getItems, getPageInfo, getKey };
    }

    /**
    * @todo Move this to QueryBuilder
    */
    key2Method(key = '') {
        return key.split('-').map((item, index)=> {
            return index > 0
                ? item.charAt(0).toUpperCase() + item.slice(1)
                : item;
        }).join('');
    }

    /**
    * @todo Move this to QueryBuilder
    */
    getQueryByKey() {
        let grammarObject = {
            url: '',
            method: 'GET',
            getItems: ()=> {},
            getPageInfo: ()=> {},
            getKey: ()=> {}
        };
        let method = this.key2Method(this.where.queryKey);
        if (typeof this[method] === 'function') {
            grammarObject = this[method](grammarObject);
        }
        return grammarObject;
    }

    artistsTopTracks(grammar) {
        grammar.url = `/${ this.from }/${ this.where.id }` +
            `/top-tracks?country=${ this.where.market }`;
        grammar.getItems = (response) => { return response.tracks; };
        grammar.getKey = (item) => { return item.type; };
        return grammar;
    }

    artistsAlbums(grammar) {
        grammar.url = `/${ this.from }/${ this.where.id }` +
            `/albums?` +
            `country=${ this.where.market }` +
            `&limit=${ this.page.limit }` +
            `&offset=${ this.page.offset }`;
        grammar.getItems = (response) => { return response.items; };
        grammar.getPageInfo = (response) => { return response; };
        grammar.getKey = (item) => { return item.type; };
        return grammar;
    }

    relatedArtists(grammar) {
        grammar.url = `/${ this.from }/${ this.where.id }` +
            `/related-artists`;
        grammar.getItems = (response) => { return response[this.from]; };
        grammar.getKey = (item) => { return item.type; };
        return grammar;
    }

    //browse methods
    featuredPlaylists(grammar) {
        grammar.url = `/${ this.from }/${ this.where.queryKey }`;
        grammar.getItems = (response) => { return response[this.where.type].items; };
        grammar.getPageInfo = (response) => { return response[this.where.type]; };
        grammar.getKey = (item) => { return item.type; };
        return grammar;
    }

    newReleases(grammar) {
        //same behavior than featuredPlaylists
        grammar.url = `/${ this.from }/${ this.where.queryKey }`;
        grammar.getItems = (response) => { return response[this.where.type].items; };
        grammar.getPageInfo = (response) => { return response[this.where.type]; };
        grammar.getKey = (item) => { return item.type; };
        return grammar;
    }

    categories(grammar) {
        grammar.url = `/${ this.from }/${ this.where.queryKey }`;
        grammar.getItems = (response) => { return response[this.where.type].items; };
        grammar.getPageInfo = (response) => { return response[this.where.type]; };
        grammar.getKey = (item) => { return 'category'; };
        return grammar;
    }

    getCategorysPlaylists(grammar) {
        grammar.url = `/${ this.from }/categories/${ this.where.id }/playlists`;
        grammar.getItems = (response) => { return response[this.where.type].items; };
        grammar.getPageInfo = (response) => { return response[this.where.type]; };
        grammar.getKey = (item) => { return item.type; };
        return grammar;
    }

    // profile methods
    following(grammar) {
        grammar.url = `/${ this.from }/following/?` +
            `type=${ this.where.type }`;
        grammar.getItems = (response) => { return response.artists.items; };
        grammar.getPageInfo = (response) => { return response.artists; };
        grammar.getKey = (item) => { return item.type; };
        return grammar;
    }

    follow(grammar) {
        grammar.url = `/${ this.from }/following/?` +
            `type=${ this.where.type.toLowerCase() }&ids=${ this.where.ids }`;
        grammar.method = 'PUT';
        return grammar;
    }

    unfollow(grammar) {
        grammar.url = `/${ this.from }/following/?` +
            `type=${ this.where.type.toLowerCase() }&ids=${ this.where.ids }`;
        grammar.method = 'DELETE';
        return grammar;
    }

    isFollowing(grammar) {
        grammar.url = `/${ this.from }/following/contains?` +
            `type=${ this.where.type.toLowerCase() }&ids=${ this.where.ids }`;
        return grammar;
    }

    template(grammar) {
        return grammar;
    }
}

export default SpotifyGrammar;
