"use strict";

const User = require('./User');

/**
* @prop {String} id The ID of the message
* @prop {String} content Message content

*/
class Message {
    constructor(client, data) {
        this.id = data.id;
        this.content = data.content;
        // this.author = client.users.get(data.author.id) || new User(data.author);
    }
}

module.exports = Message;
