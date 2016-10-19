"use strict";

const Member = require('./Member');
const Channel = require('./Channel');

/**
* @prop {String} id The Guild ID
* @prop {String} name The Guild Name
* @prop {String} icon The Guild Icon
* @prop {String} region The Guild Region
* @prop {String} owner_id The Guild's Owner's ID
* @prop {Array} roles The guild's roles
* @prop {Array} emojis The guilds custom emojis
*/

class Guild {
    constructor(client, data) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.region = data.region;
        this.roles = data.roles;
        this.emojis = data.emojis;
        this.channels = new Map(data.channels.map(channel => [channel.id, new Channel(client, channel)]));
        this.members = new Map(data.members.map(member => [member.user.id, new Member(client, member)]));
        this.owner = this.members.get(data.owner_id).user;
    }
    
    get iconURI() {
        return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.jpg`
    }
}


module.exports = Guild;