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

    static get groupName() { return 'users'; }
    static get singleName() { return 'user'; }

    static me() {
        let builder = new Builder(Me);
        return builder;
    }

    static findMe() {
        return this.me().getEntity();
    }

    static following(config = {}) {
        let localConfig = {
            type: 'artist' //currently only artist is supported by endpoint
        };
        let builder = this.me();
        builder.config = Object.assign(config, localConfig);
        return builder.getByKey('following', config);
    }

    static follow(param) {
        return this._socialAction('follow', param);
    }

    static unfollow(param) {
        return this._socialAction('unfollow', param);
    }

    static isFollowing(param) {
        return this._socialAction('is-following', param);
    }

    static _socialAction(action, param) {
        let type;
        let ids;
        if (param.length !== undefined) {
            type = param[0].type;
            ids = (param.map(item => { return item.id; })).join(',');
        } else {
            type = param.constructor.singleName;
            ids = param.id;
        }
        let config = {
            type,
            ids
        };
        let builder = this.me();
        builder.config = config;
        return builder.getByKey(action, config);
    }

}

/**
* Profile class representing current user.
*/
class Me extends Profile {
    static get groupName() { return 'me';}

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

module.exports ={Profile, Me};
