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
        this.username = data.useraname;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.bot = data.bot;
    }
    
    get userMention() { return `<@${this.id}>`; }
}

module.exports = User;
