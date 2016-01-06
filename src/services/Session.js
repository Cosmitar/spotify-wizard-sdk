'use strict';
import Connection from './Connection';
//@TODO implement Config
import Config from './../utils/Config';

/**
* Flag for avoid multiple instances of Session class
* @type {boolean}
*/
var  singletonSession = false;

/**
* Handles auth process and sets the token on APICLient for future queries.
*/
class Session {
    /**
    * Builds the object and initializes variables.
    * @constructor
    */
    constructor() {
        /**
        * @type {string}
        */
        this._token = '';
        /**
        * @type {string}
        */
        this._clientId = '';
        /**
        * @type {string}
        */
        this._secretId = '';
        /**
        * @type {string}
        */
        this._scopes = '';
        /**
        * @type {string}
        */
        this._redirect_uri = '';
    }

    /**
    * Sets variables by given data.
    * @param {object} data
    */
    config(data) {
        this._token = data.token;
        this._clientId = data.clientId;
        this._secretId = data.secretId;
        this._scopes = data.scopes;
        this._redirect_uri = data.redirect_uri;
    }

    /**
    * Sets a token keeping it internally and passing it to Connection
    * @param {string} value The token
    */
    set token(value) {
        this._token = value;
        Connection.token = this._token;
    }

    /**
    * Builds the authorization url with the stored parameters.
    * @return {Promise}
    */
    login() {
        return new Promise((resolve, reject) => {
            let loginUrl = 'https://accounts.spotify.com/en/authorize?' +
                'response_type=token&client_id=' +
                this._clientId + '&redirect_uri=' + encodeURIComponent(this._redirect_uri) +
                (this._scopes ? '&scope=' + encodeURIComponent(this._scopes) : '');
            resolve(loginUrl);
        });
    }
}

if (!singletonSession) {
    singletonSession = new Session;
}

export default singletonSession;
