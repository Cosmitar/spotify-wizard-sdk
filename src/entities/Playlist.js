'use strict';
import Model from './../core/Model';
import Creator from './../core/Creator';

class Playlist extends Model {
    // STATIC METHODS
    static get groupName() {
        return 'playlists';
    }
}

Creator.addFactory('Playlist', Playlist);
export default Playlist;
