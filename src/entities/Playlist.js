'use strict';
import Model from './../core/Model';
import Creator from './../core/Creator';
import Builder from './../core/Builder';
import {Profile} from './Profile';

class Playlist extends Model {
    // STATIC METHODS
    static get groupName() {
        return 'playlists';
    }

    static find(id, user_id = '') {
        //@think FROM users ID user_id JOIN/CONTAINS playlists ID playlist_id
        // CONTAINS can be nested
        return new Promise((resolve, reject) => {
            let builder = new Builder(Playlist);
            let config = { id: id };
            if (user_id == '') {
                Profile.findMe().then((me) => {
                    config.user_id = me.id;
                    resolve(builder.getByKey('playlist', config));
                });
            } else {
                config.user_id = user_id;
                resolve(builder.getByKey('playlist', config));
            }
        });
    }

    /**
    * @todo Current user should be global via Session and keeped on while token is valid (1hr)
    */
    follow() {
        let builder = new Builder(Playlist);
        let config = {
            user_id: this.owner.id,
            id: this.id
        };
        return builder.insertByKey('follow-playlist', config);
    }
}

Creator.addFactory('Playlist', Playlist);
export default Playlist;
