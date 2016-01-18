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
    getTopTracks(country = 'US') {
        let vars = {
            country
        };
        let builder = new Builder(Artist);
        builder.query
            .id('artists-top-tracks')
            .select()
            .from('artists', this.id)
            .field('top-tracks')
            .where(vars);
        return builder.build();
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
        let vars = {
            album_type,
            market,
            limit,
            offset
        };
        let builder = new Builder(Artist);
        builder.query
            .id('artists-albums')
            .select()
            .from('artists', this.id)
            .field('albums')
            .where(vars);
        return builder.build();
    }

    getRelatedArtists() {
        let builder = new Builder(Artist);
        builder.query
            .id('artist-related-artists')
            .select()
            .from('artists', this.id)
            .field('related-artists');
        return builder.build();
    }
}

Creator.addFactory('Artist', Artist);
export default Artist;
