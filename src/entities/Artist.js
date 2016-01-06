'use strict';
import Model from './../core/Model';
import Creator from './../core/Creator';
import Builder from './../core/Builder';
import Track from './Track';

const SMALL_IMAGE_THRESHOLD = 80;
const MEDIUM_IMAGE_THRESHOLD = 300;
const LARGE_IMAGE_THRESHOLD = 900;

class Artist extends Model {
    static get groupName() {
        return 'artists';
    }

    static _getNotFillable() {
        return ['albums', 'tracks'];
    }

    /**
    * Extends where method to force search param 'type' as class name
    */
    static where(queryString, config = {}) {
        config.type = this.name;
        return super.where(queryString, config);
    }

    /**
    * Retrieves the top-tracks for the artist.
    *     List based on Spotify top-tracks concept.
    * @param {string} country The country for the search (ISO 3166-1 alpha-2 country code)
    * @see https://developer.spotify.com/web-api/get-artists-top-tracks/
    * @return {Promise}
    */
    getTopTracks(country) {
        let config = {
            id: this.id,
            market: country,
            type: 'tracks'
        };
        let builder = new Builder(Artist);
        builder.config = config;
        return builder.getByKey('artists-top-tracks', config).then(tracks => {
            this._topTracks = tracks;
            return this._topTracks;
        });
    }

    /**
    * Initializes a conditional query for the artist's albums.
    *     You can set the album type, market, limit and offset by paramteres.
    * @param {string=album} album_type Optional album type.
    * @param {string=US} market The country for the search (ISO 3166-1 alpha-2 country code).
    * @param {integer=20} limit The number of album objects to return.
    * @param {integer=0} offset The index of the first album to return.
    * @see https://developer.spotify.com/web-api/get-artists-albums/.
    * @return {Promise}
    */
    getAlbums(album_type = 'album', market = 'US', limit = 20, offset = 0) {
        let config = {
            id: this.id,
            album_type: album_type,
            market: market,
            limit: limit,
            offset: offset,
            type: 'albums'
        };
        let builder = new Builder(Artist);
        builder.config = config;
        return builder.getByKey('artists-albums', config).then(page => {
            this._albums = page.elements;
            return page;
        });
    }

    getRelatedArtists() {
        let config = {
            id: this.id
        };
        let builder = new Builder(Artist);
        builder.config = config;
        return builder.getByKey('related-artists', config).then(artistsCollection => {
            this._artists = artistsCollection;
            return artistsCollection;
        });
    }
}

Creator.addFactory('Artist', Artist);
export default Artist;
