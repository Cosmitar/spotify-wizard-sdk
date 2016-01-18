'use strict';
import Model from './../core/Model';
import Builder from './../core/Builder';

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
    static getFeaturedPlaylists(locale, country, timestamp, limit, offset) {
        const vars = {
            locale, country, timestamp, limit, offset
        };
        const builder = new Builder(Browse);
        builder.query
            .id('browse-featured-playlists')
            .select()
            .from('browse')
            .field('featured-playlists')
            .where(vars);
        return builder.build();
    }

    /**
    * Get a list of new album releases featured in Spotify.
    * Config accepts: country, limit, offset
    * Authorization required
    * @param {object=} config See https://developer.spotify.com/web-api/get-list-new-releases/.
    */
    static getNewAlbumReleases(country, limit, offset) {
        const vars = {
            country, limit, offset
        };
        const builder = new Builder(Browse);
        builder.query
            .id('browse-new-releases')
            .select()
            .from('browse')
            .field('new-releases')
            .where(vars);
        return builder.build();
    }

    /**
    * Get a List of Categories
    * Config accepts: locale, country, limit, offset
    * Authorization required
    * @param {object=} config See https://developer.spotify.com/web-api/get-list-categories/
    */
    static getCategories(locale, country, limit, offset) {
        const vars = {
            locale, country, limit, offset
        };
        const builder = new Builder(Browse);
        builder.query
            .id('browse-categories')
            .select()
            .from('browse')
            .field('categories')
            .where(vars);
        return builder.build();
    }

    /**
    * Get a category's playlists
    * Config accepts: country, limit, offset
    * Authorization required
    * @param {string=} category_id The id of a valid category
    * @param {object=} config See https://developer.spotify.com/web-api/get-categorys-playlists/
    */
    static getCategoryPlaylists(category_id = '', config = {}) {
        let vars = Object.assign({
            category_id
        }, config);
        let builder = new Builder(Browse);
        builder.query
            .id('browse-playlist-category')
            .select()
            .from('browse')
            .from('categories', category_id)
            .field('playlists')
            .where(vars);
        return builder.build();
    }
}

export default Browse;
