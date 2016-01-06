'use strict';
import Model from './../core/Model';
import Creator from './../core/Creator';
import Builder from './../core/Builder';
import Playlist from './Playlist';
import Album from './Album';
import Category from './Category';

class Browse extends Model {
    static get groupName() {
        return 'browse';
    }

    /**
    * Get a list of Spotify featured playlists.
    * Config accepts: locale, country, timestamp, limit, offset
    * Authorization required
    * @param {object=} config See https://developer.spotify.com/web-api/get-list-featured-playlists/
    */
    static getFeaturedPlaylists(config = {}) {
        let localConfig = {
            type: 'playlists'
        };
        let builder = new Builder(Browse);
        builder.config = Object.assign(config, localConfig);
        // How to expose response value: message?
        return builder.getByKey('featured-playlists', config);
    }

    /**
    * Get a list of new album releases featured in Spotify.
    * Config accepts: country, limit, offset
    * Authorization required
    * @param {object=} config See https://developer.spotify.com/web-api/get-list-new-releases/.
    */
    static getNewAlbumReleases(config = {}) {
        let localConfig = {
            type: 'albums'
        };
        let builder = new Builder(Browse);
        builder.config = Object.assign(config, localConfig);
        return builder.getByKey('new-releases', config);
    }

    /**
    * Get a List of Categories
    * Config accepts: locale, country, limit, offset
    * Authorization required
    * @param {object=} config See https://developer.spotify.com/web-api/get-list-categories/
    */
    static getCategories(config = {}) {
        let localConfig = {
            type: 'categories'
        };
        let builder = new Builder(Browse);
        builder.config = Object.assign(config, localConfig);
        return builder.getByKey('categories', config);
    }

    /**
    * Get a category's playlists
    * Config accepts: country, limit, offset
    * Authorization required
    * @param {string=} category_id The id of a valid category
    * @param {object=} config See https://developer.spotify.com/web-api/get-categorys-playlists/
    */
    static getCategoryPlaylists(category_id = '', config = {}) {
        let localConfig = {
            id: category_id,
            type: 'playlists'
        };
        let builder = new Builder(Browse);
        builder.config = Object.assign(config, localConfig);
        return builder.getByKey('get-categorys-playlists', config);
    }
}

export default Browse;
