'use strict';
import Model from './../core/Model';
import Creator from './../core/Creator';
import Builder from './../core/Builder';

/**
*
*/
class Profile extends Model {

    /**
    * protect attributes from mass assignment
    */
    static getNotFillable() {
        return ['albums', 'tracks'];
    }

    static get groupName() {
        return 'users';
    }
    static get singleName() {
        return 'user';
    }

    static me() {
        let builder = new Builder(Me);
        return builder;
    }

    static findMe() {
        return this.me().getEntity();
    }

    /**
    * Get the current user’s followed artists.
    * Config accepts: type, limit, after
    * Authorization required
    * @param {object=} config See https://developer.spotify.com/web-api/get-followed-artists/
    */
    static following(config = {}) {
        let vars = Object.assign({
            type: 'artist' // currently only artist is supported by endpoint
        }, config);
        let builder = this.me();
        builder.query
            .id('get-user-followed-artists')
            .select()
            .from('me')
            .field('following')
            .where(vars);
        return builder.build();
    }

    /**
    * Add the current user as a follower of one or more artists or other Spotify users.
    * Config accepts: type, ids
    * Authorization required
    * @param {object=} config See https://developer.spotify.com/web-api/follow-artists-users/
    */
    static follow(config) {
        let vars = this._getSocialConfig(config);
        let builder = this.me();
        builder.query
            .id('user-follow-actions')
            .insert()
            .into('me')
            .field('following')
            .where(vars);
        return builder.build();
    }

    /**
    * Remove the current user as a follower of one or more artists or other Spotify users.
    * Config accepts: type, ids
    * Authorization required
    * @param {object=} config See https://developer.spotify.com/web-api/unfollow-artists-users/.
    */
    static unfollow(config) {
        let vars = this._getSocialConfig(config);
        let builder = this.me();
        builder.query
            .id('user-follow-actions')
            .delete()
            .from('me')
            .field('following')
            .where(vars);
        return builder.build();
    }

    /**
    * Check to see if the current user is following one or more artists or other Spotify users.
    * Config accepts: type, ids
    * Authorization required
    * @param {object=} config See https://developer.spotify.com/web-api/check-current-user-follows/.
    */
    static amIFollowing(config) {
        let vars = this._getSocialConfig(config);
        let builder = this.me();
        builder.query
            .id('user-follow-actions')
            .select()
            .from('me')
            .field('following')
            .field('contains')
            .where(vars);
        return builder.build();
    }

    static _getSocialConfig(param) {
        let type;
        let ids;
        if (param.length !== undefined) {
            type = param[0].type;
            ids = (param.map(item => item.id)).join(',');
        } else {
            type = param.constructor.singleName;
            ids = param.id;
        }
        let config = {
            type,
            ids
        };
        return config;
    }

}

/**
* Profile class representing current user.
*/
class Me extends Profile {
    static get groupName() {
        return 'me';
    }

    getTracks(market = 'US', limit = 20, offset = 0) {
        let config = {
            id: 'me',
            market: market,
            limit: limit,
            offset: offset,
            type: 'tracks'
        };
        let builder = new Builder(Me);
        builder.config = config;
        return builder.getByKey('saved-tracks', config).then(page => {
            this._albums = page.elements;
            return page;
        });
    }
}
Creator.addFactory('Profile', Profile);
Creator.addFactory('Me', Profile);

module.exports = { Profile, Me };
