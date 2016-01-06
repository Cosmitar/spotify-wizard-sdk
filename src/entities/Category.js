'use strict';
import Model from './../core/Model';
import Creator from './../core/Creator';
import Browse from './Browse';

class Category extends Model {
    // STATIC METHODS
    static get groupName() {
        return 'Categories';
    }

    /**
    * Get a list of Spotify playlists tagged with this category.
    * Config accepts: country, limit, offset
    * @param {object=} config See https://developer.spotify.com/web-api/get-categorys-playlists/
    */
    getPlaylist(config = {}) {
        return Browse.getCategoryPlaylists(this.id, config);
    }
}

Creator.addFactory('Category', Category);
export default Category;
