"use strict";

class Invite {
    constructor(data) {
        this.code = data.code
        this.guild = data.guild
        this.channel = data.channel
    }
}

module.exports = Invite