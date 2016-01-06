'use strict';
import Model from './../core/Model';
import Creator from './../core/Creator';

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
Creator.addFactory('track', Track);
export default Track;
