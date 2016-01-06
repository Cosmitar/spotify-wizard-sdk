'use strict';

/**
* Flag for avoid multiple instances of Config class
* @type {boolean}
*/
let singletonConfig = false;

class Config {

}

if (!singletonConfig) {
    singletonConfig = new Config;
}

export default singletonConfig;
