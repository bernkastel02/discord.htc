'use strict';
const Client = require("./code/Client");

function DHTC(token) {
	return new Client(token)
	/* discord.htc Client Passer */
}

const Message = require("./code/structs/Message");
const User = require("./code/structs/User");
const Channel = require("./code/structs/Channel");
const Guild = require("./code/structs/Guild");
const VoiceRegion = require("./code/structs/voice/VoiceRegion");
const VoiceServer = require("./code/structs/voice/VoiceServer");
const Role = require("./code/structs/Role");
const Invite = require("./code/structs/Invite");
const Constants = require("./code/Consts")

DHTC.Client = Client;
DHTC.Message = Message;
DHTC.User = User;
DHTC.Channel = Channel;
DHTC.Guild = Guild;
DHTC.VoiceRegion = VoiceRegion;
DHTC.VoiceServer = VoiceServer;
DHTC.Role = Role;
DHTC.Invite = Invite;
DHTC.Constants = Constants;

/* EXTENSIONS */

const Base = require("./code/extensions/BotBase");

DHTC.BotBase = Base;

module.exports = DHTC;