"use strict";


class VoiceServer {
    constructor(data) {
        this.token = data.token;
        this.guild_id = data.guild_id;
        this.endpoint = data.endpoint;
    }
}

module.exports = VoiceServer;