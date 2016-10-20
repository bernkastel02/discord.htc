"use strict";

/**
* @prop {String} id The ID of the user
* @prop {String} username The Username of the user
* @prop {String} discriminator The User's Discriminator
* @prop {String} avatar The hash of the users avatar
* @prop {Boolean} bot Determines whether the user is a bot or not (true or false)
*/
class User {
    constructor(data) {
        this.id = data.id;
        this.username = this.name = data.username;
        this.discriminator = this.discrim = data.discriminator;
        this.avatar = data.avatar;
        this.avatarURL = (data.avatar === 'f78426a064bc9dd24847519259bc42af') ? `https://discordapp.com/assets/${data.avatar}.png` : `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.jpg`;
        this.bot = data.bot;
    }
    
    get userMention() { return `<@${this.id}>`; }
}

module.exports = User;