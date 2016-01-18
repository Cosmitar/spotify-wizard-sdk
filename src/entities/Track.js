'use strict';
import Model from './../core/Model';
import Creator from './../core/Creator';

/**
* IMPORTANT: If you plan to remove the track from a playlist or save it to “Your Music”
* it is important that you operate on the original track id found in the LINKED_FROM object.
* Using the ID of the linked track returned at the root level will likely return an error
* or other unexpected result.
* @see https://developer.spotify.com/web-api/track-relinking-guide/
*/

class Track extends Model {
    // STATIC METHODS
    static get groupName() {
        return 'tracks';
    }

    /**
    * Extends where method to force search param 'type' as class name
    */
    static where(queryString, config = {}) {
        config.type = this.name;
        return super.where(queryString, config);
    }
}

Creator.addFactory('Track', Track);
export default Track;
