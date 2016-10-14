"use strict";

/**
* @prop {String} id The channel ID
*/

class Channel {
    constructor(data) {
        this.id = data.id;
        this.channelType = data.type;
    }
}


module.exports = Channel;