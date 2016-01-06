'use strict';
import Model from './../core/Model';
import Creator from './../core/Creator';
import Artist from './Artist';
import Track from './Track';

class Album extends Model {

    static get groupName() {
        return 'albums';
    }

    static getNotFillable() {
        return ['tracks','artists'];
    }

    /**
    * Extends where method to force search param 'type' as class name
    */
    static where(queryString, config = {}) {
        config.type = this.name;
        return super.where(queryString, config);
    }

    get tracks() {
        let retVal = [];
        if (this.original) {
            let trackCollection = [];
            for (let trackData of this.original.tracks.items) {
                trackCollection.push(new Track(trackData));
            }
            retVal = trackCollection;
        }
        return retVal;
    }

    get artists() {
        let retVal = [];
        if (!this.simplified) {
            let artistsCollection = [];
            let artists = this.original.artists.length > 0
                ? this.original.artists
                : this.original.artists.items;
            for (let artistData of artists) {
                artistsCollection.push(new Artist(artistData));
            }
            retVal = artistsCollection;
        } else {
            console.warn('Simplified Album (%s) doesn\'t have artists.' +
                ' Make album.get() before request album.artists attribute.' +
                ' See https://developer.spotify.com/web-api/endpoint-reference/',
                this.name
            );
        }
        return retVal;
    }

    get cover() {
        return this.images && this.images.length > 0 ? this.images[0].url : '';
    }
}

Creator.addFactory('Album', Album);
export default Album;
