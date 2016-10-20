"use strict";

const User = require('./User');

/**
* @prop {String} id The channel ID
*/

class DMChannel {
    constructor(data) {
        this.id = data.id;
        this.channelType = this.type = data.type;
        this.recipient = new User(data.user);
        this.isPrivate = data.is_private;
    }
}


module.exports = DMChannel;