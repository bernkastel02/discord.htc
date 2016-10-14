"use strict";

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
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.region = data.region;
        this.owner_id = data.owner_id;
        this.roles = data.roles;
        this.emojis = data.emojis
    }
}


module.exports = Guild;