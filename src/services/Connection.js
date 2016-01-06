'user strict';

var singletonClient = false;

class Connection {
    constructor() {
        this._token;
    }

    set token(value) {
        this._token = value;
    }

    get token() {
        return this._token;
    }

    toQueryString(obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    }

    fetch(endpoint, method, payload) {
        let _headers = { Accept: 'application/json' };
        let _url;
        let _payload;

        if (this._token) {
            _headers.Authorization = `Bearer ${this._token}`;
        }

        if (endpoint.indexOf('https') > -1) {
            _url = endpoint;
        } else {
            _url = `https://api.spotify.com/v1${endpoint}`;
        }

        if (method === 'GET') {
            if (payload) {
                let separator = _url.indexOf('?') !== -1 ? '&' : '?';
                _url = _url + separator + this.toQueryString(payload);
            }
        } else {
            _payload = JSON.stringify(payload);
        }

        let checkStatus = (response) => {
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                var error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        };

        let parseJSON = (response) => {
            return response.status == 200 ? response.json() : response;
        };

        return fetch(_url, {
            method: method || 'GET',
            headers: _headers,
            body: _payload
        }).then(checkStatus)
        .then(parseJSON);
    };

    loginRequest(url) {
        return this.fetch(url);
    }

    request(url, method, payload) {
        return this.fetch(url, method, payload);
    }
}

if (!singletonClient) {
    singletonClient = new Connection;
}

export default singletonClient;
