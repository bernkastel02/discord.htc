"use strict";

const User = require('./User');

/**
* @prop {String} id The ID of the user
* @prop {String} username The Username of the user
* @prop {String} discriminator The User's Discriminator
* @prop {String} avatar The hash of the users avatar
* @prop {Boolean} bot Determines whether the user is a bot or not (true or false)
*/
class BotUser extends User {
    constructor(client, data) {
        this.email = data.email;
        this.verified = data.verified;
        this.mfa = data.mfa_enabled;
    }
}

module.exports = User;