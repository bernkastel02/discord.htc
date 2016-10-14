"use strict";

/**
* @prop {String} id The ID of the message
* @prop {String} content Message content

*/
class Message {
    constructor(data) {
        this.id = data.id;
        this.type = data.type;
    }
}

module.exports = Message;
