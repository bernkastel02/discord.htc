"use strict";

const User = require('./User');

/**
* @prop {String} id The channel ID
*/

class DMChannel {
    constructor(client, data) {
        this.id = data.id;
        this.channelType = this.type = data.type;
        this.recipient = new User(client, data.user);
        this.isPrivate = data.is_private;
    }
}


module.exports = DMChannel;