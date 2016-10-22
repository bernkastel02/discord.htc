"use strict";

const User = require('./User');

/**
* @prop {String} id The ID of the member
* @prop {String} username The username of the member
* @prop {String} discriminator The member's discriminator
* @prop {String} avatar The hash of the member avatar
* @prop {Boolean} bot Determines whether the member is a bot or not (true or false)
*/
class Member {
    constructor(client, data) {
        this.nick = this.nickname = data.nick;
        this.id = data.user.id;
        this.username = this.name = data.user.username;
        this.discriminator = this.discrim = data.discriminator;
        this.avatar = data.user.avatar;
        this.roles = data.roles;
        this.bot = data.user.bot;
        this.user = new User(data.user);
    }
}

module.exports = Member;