"use strict";

/**
* @prop {String} id The channel ID
*/

class Channel {
    constructor(client, data, guild_id) {
        this.id = data.id;
        this.channelType = this.type = data.type;
        this.name = data.name;
        this.guild = client.guilds.get(guild_id);
    }
}


module.exports = Channel;