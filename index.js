'use strict';
const Client = require("./lib/Client");

function DHTC(token) {
	return new Client(token)
	/* discord.htc Client Passer */
}

const Message = require("./lib/structs/Message");
const User = require("./lib/structs/User");
const Channel = require("./lib/structs/Channel");
const Guild = require("./lib/structs/Guild");
const VoiceRegion = require("./lib/structs/voice/VoiceRegion");
const VoiceServer = require("./lib/structs/voice/VoiceServer");
const Role = require("./lib/structs/Role");
const Invite = require("./lib/structs/Invite");
const Constants = require("./lib/Consts")

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

const Base = require("./lib/extensions/BotBase");

DHTC.BotBase = Base;

module.exports = DHTC;