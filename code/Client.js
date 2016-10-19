'use strict';
const WebSocket = require("ws"), request = require('request'), Zlib = require("zlib"), requestp = require('request-promise-any'), fs = require('fs')
const dgram = require('dgram');
const ws = new WebSocket('wss://gateway.discord.gg/?v=6')


var EventEmitter, Promise;
EventEmitter = require("events").EventEmitter;
try {
    Promise = require("bluebird");
} catch(err) {
    Promise = global.Promise;
}
var url = ("https://discordapp.com/api")

const User = require("./structs/User");
const Message = require("./structs/Message")
const Channel = require("./structs/Channel")
const Guild = require("./structs/Guild")
const Member = require("./structs/Member")
const Role = require("./structs/Role")
const Invite = require("./structs/Invite")
const VoiceRegion = require("./structs/voice/VoiceRegion");
const VoiceServer = require("./structs/voice/VoiceServer");


/**
* The client definitive
* @extends EventEmitter
* @prop {String} token
* @prop {Number} startT
* @prop {Number} uptime
*/
class Client extends EventEmitter {
    
	/**
	*	Client Constructor
	*	@arg {String} token
	*	@returns {Client} Client object
	*/
    constructor(token) {
        super();
        
        if (!token) { return "There are no tokens used for this client!" }
        
        this.token = token;
        this.isReady = false;
    	this.game = "";
    	this.startT = 0;
    	this.users = new Map();
    	this.guilds = new Map();
    	this.channels = new Map();
		
		request.get({ url: `${url}/gateway?encoding=json&v=6` }).on('response', function(response) {  })
    }
    
    /**
     * The Connection client
     */
	connect() {
		ws.on('open', () => {
    		
		});
		
		
		ws.on("message", (data, flags) => {
            if (flags.binary)
                data = Zlib.inflateSync(data).toString();
                var message = JSON.parse(data);
                // do something with message
                if(message.s) {
                    this.sequence = message.s;
                } // probs fixed..? commit 3
            switch(message.op) {
                case 10:
                    ws.send(JSON.stringify({
        	            "op": 2,
        	            "d": {
        		            large_theshold: 250,
        		            compress: true,
        		            properties: {
        			            $os: process ? process.platform : 'windows',
        			            $browser: "discord.htc",
        			            $device: "discord.htc",
        			            $referrer: '',
        			            $referring_domain: ''
        		            },
        		            token: this.token
        	            }
                    }))
                    this.heartbeatInterval = setInterval(()=>{
                        ws.send(JSON.stringify({
                            op: 1,
                            d: this.sequence
                        }))
                    }, message.d.heartbeat_interval);
                    break;
                    
                case 0:
                    switch(message.t) {
                    case "READY":
                    	this.emit("botReady")
                    	this.isReady = true;
                    	this.startT = Date.now();
                    	this.users.set('1', {
                    	    username: 'Clyde',
                    	    discriminator: '0000',
                    	    id: '1',
                    	    avatar: 'f78426a064bc9dd24847519259bc42af',
                    	    bot: true
                    	})
                    break;
                    
                    case "MESSAGE_CREATE":
                    	this.emit("createdMessage", new Message(this, message.d))
                    	this.author = new User(this, message.d.author);
                    break;
                    case "MESSAGE_DELETE":
                    	this.emit("deletedMessage", message.d)
                    break;
                    case "MESSAGE_UPDATE":
                        this.emit("messageUpdated", message.d)
                    break;
                    
                    case "GUILD_CREATE":
                    	this.emit("guildAdd", message.d)
                    	this.guilds.set(message.d.id, new Guild(this, message.d));
                    	message.d.channels.forEach(channel => this.channels.set(channel.id, new Channel(this, channel, message.d.id)))
                    	message.d.members.map(member => member.user).forEach(user => {
                    	   if (!this.users.has(user.id)) this.users.set(user.id, new User(this, user));
                    	})
                    	this.guild = new Guild(this, message.d)
                    break;
                    case "GUILD_UPDATE":
                    	this.emit("guildUpdate", message.d)
                    	this.guild = new Guild(this, message.d)
                    break;
                    case "GUILD_DELETE":
                    	this.emit("guildDelete", message.d)
                    	this.guilds.delete(message.d.id);
                    break;
                    case "GUILD_BAN_ADD":
                    	this.emit("guildBanAdd", message.d)
                    break;
                    case "GUILD_BAN_REMOVE":
                    	this.emit("guildBanAdd", message.d)
                    break;
                    case "GUILD_ROLE_CREATE":
                    	this.emit("guildRoleCreate", message.d)
                    	this.role = new Role(this, message.d.role)
                    break;
                    case "GUILD_ROLE_UPDATE":
                    	this.emit("guildRoleUpdate", message.d)
                    	this.role = new Role(this, message.d.role)
                    break;
                    case "GUILD_ROLE_DELETE":
                    	this.emit("guildRoleDelete", message.d)
                	break;
                	case "GUILD_MEMBER_ADD":
                		this.emit("guildMemberJoin", message.d)
                		if (!this.users.has(message.d.user.id)) this.users.set(message.d.user.id, new Member(message.d));
                		this.guilds.get(message.d.guild_id).members.set(message.d.user.id, new Member(this, message.d));
                	break;
                	case "GUILD_MEMBER_UPDATE":
                		this.emit("guildMemberUpdate", message.d)
                		this.guilds.get(message.d.guild_id).members.set(message.d.user.id, new Member(this, message.d));
                	break;
                	case "GUILD_MEMBER_REMOVE":
                		this.emit("guildMemberLeave", message.d);
                		this.guilds.get(message.d.guild_id).members.delete(message.d.user.id);
                		if (this.users.has(message.d.user.id)) this.users.delete(message.d.user.id);
                	break;
                		
                	
                	case "CHANNEL_CREATE":
                		this.emit("channelCreate", message.d)
                	break;
                	case "CHANNEL_UPDATE":
                		this.emit("channelUpdate", message.d)
                	break;
                	case "CHANNEL_DELETE":
                		this.emit("channelDelete", message.d)
                	break;
                	
                    case "VOICE_SERVER_UPDATE":
                    	this.emit("voiceGuildChange", message.d)
                    	this.voice = new VoiceServer(this, message.d)
                    break;
                    
                    case "TYPING_START":
                    	this.emit("userTyping", message.d)
                    break;
                    
                    case "RESUMED":
                    	this.emit("resumed", message.d)
                    break;
                    
                    case "PRESENCE_UPDATE":
                    	this.emit("presenceUpdate", message.d)
                    break;
                    case "USER_UPDATE":
                        this.emit("userUpdate", message.d)
                        this.users.set(message.d.id, new User(message.d))
                    break;
                    	
                }
                break;
            }
		});
	}
	
	get uptime() {
	    return (this.startT ? Date.now() - this.startT : 0);
	}

	/**
	* Create a message in a channel
	* @arg {String} channelID: The ID of a channel
	* @arg {String} content: The content of a message
	*/
	
	makeMessage(channelID, content) {
		if (content == null) {
			return;
		}
		let options = {
    		method: 'POST',
			uri: `${url}/channels/${channelID}/messages`,
    		json: true, // Automatically stringifies the body to JSON
    		form: {
        		'content': `${content}`
    		},
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};
		return requestp(options).then((message) => { new Message(message, this) }).catch(function (err) { return new Promise.reject(new Error("You don't have permission in channel to Send Message")) });
	}

	/**
	* Remove a message from a channel
	* @arg {String} channelID: The ID of a channel
	* @arg {String} messageID: The ID of a Message
	*/
	
	snipMessage(channelID, messageID) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/channels/${channelID}/messages/${messageID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission in channel to Delete Message")); });
	}
	
	/**
	 * Changes the game the bot is playing
	 * @arg {String} botGame The name of the game
	 */
	changeGame(botGame, awaytime) {
		if (botGame !== undefined) {
			this.game = botGame;
		}
		ws.send(JSON.stringify({
			op: 3,
			d: { 
				"idle_since": awaytime, 
				"game": {
					"name": `${botGame}`	
				}
			}
    	}))
	}
	
	/**
	 * Creates a Channel
	 * @arg {String} serverID: ID of the server
	 * @arg {String} channame: The name you want to choose for the channel
	 * @arg {String} chantype: The type of channel (text or voice)
	 */
	
	makeChannel(serverID, channame, chantype) {
		let options = {
    		method: 'POST',
			uri: `${url}/guilds/${serverID}/channels`,
			body: {
				"name": `${channame}`,
				"type": `${chantype}`
			},
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		},
    		json: true // Automatically stringifies the body to JSON
		};
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to create channel or undefined channel type")); });
	}
	
	/** Creates a Role, always called new role
	 * @arg {String} serverID id of the server
	 */
	
	makeGuildRole(serverID) {
		let options = {
    		method: 'POST',
			uri: `${url}/guilds/${serverID}/roles`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to create role!")); });
	}

    changeGuildRole(serverID, roleID, roleName, rolePermissions, rolePosition, roleColor, roleHoist, roleMention) {
        let HTTPoptions = {
            method: 'PATCH',
            uri: `${url}/guilds/${serverID}/roles/${roleID}`,
            body: {
                "name": roleName,
                "permissions": rolePermissions,
                "position": rolePosition,
                "color": roleColor,
                "hoist": roleHoist,
                "mentionable": roleMention
            },
            headers: {
                'Authorization': `Bot ${this.token}`
            },
            json: true
        };
        request(HTTPoptions, (err, httpResponse, body) => {
        	if (err) { 
        		return new Promise.reject(new Error("You don't have permission to create role!"))
        	} else {
        		return Promise.resolve('wss://gateway.discord.gg/');
        	}
        })
    }

	/** Deletes a role
	 * @arg {String} serverID id of the server
	 * @arg {string} roleID id of the role you want to delete
	 */

	snipGuildRole(serverID, roleID) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/guilds/${serverID}/roles/${roleID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to delete role!")); });
	}
	
	joinVoice(serverID, voiceChannelID) {
       ws.send(JSON.stringify({
            op: 4,
            d: {
            	"guild_id": serverID,
            	"channel_id": voiceChannelID,
            	"self_mute": false,
            	"self_deaf": false
            }
        }))
        this.on("voiceGuildChange", (voice) => { 
        	this.voiceData = voice;
        });
	}

	leaveVoice() {
        ws.send(JSON.stringify({
            op: 4,
            d: {
            	"guild_id": "",
            	"channel_id": "",
            	"self_mute": false,
            	"self_deaf": false
            }
        }))
	}
	
	makeGuild(guildName, icon) {
		let options = {
    		method: 'POST',
			uri: `${url}/guilds`,
			body: {
				"name": guildName,
				"icon": icon
			},
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to create guild!")); });
	}	
	
	removeUser(serverID, userID) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/guilds/${serverID}/members/${userID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to kick this user!!")); });
	}
	
	changeMessage(channelID, messageID, content) {
        let HTTPoptions = {
            method: 'PATCH',
            uri: `${url}/channels/${channelID}/messages/${messageID}`,
            body: {
                "content": content
            },
            headers: {
                'Authorization': `Bot ${this.token}`
            },
            json: true
        };
        request(HTTPoptions, (err, httpResponse, body) => {
        	if (err) { 
        		return new Promise.reject(new Error("That message was not sent by the bot!"))
        	} else {
        		return Promise.resolve('wss://gateway.discord.gg/');
        	}
        })
	}
	
	snipChannel(channelID) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/channels/${channelID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to delete this channel!!")); });
	}
	
	
	
	uploadFile(channelID, content, filepath) {
		/* thx AbsoluteZero -Aya */
		if (content == null) {
			return;
		}
		let options = {
    		method: 'POST',
			uri: `${url}/channels/${channelID}/messages`,
			formData: {
                file: fs.createReadStream(filepath),
                content: content,
                tts: 'false'
            },
    		headers: {
        		'Authorization': `Bot ${this.token}`,
        		"Content-Type": "multipart/form-data"
    		}
		};
		return requestp(options).catch(function (err) {  return new Promise.reject(new Error("You don't have permission to post messasges or you cant upload files")); });	
	}

	
	makeInvite(channelID, age, uses) {
		let options = {
    		method: 'POST',
			uri: `${url}/channels/${channelID}/invites`,
			body: {
				"max_age": age,
				"max_uses": uses,
				"unique": true
			},
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		},
    		json: true
		};
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to create invite!")); });
	}
	
	snipInvite(invitecode) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/invites/${invitecode}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to delete this invite!!")); });
	}
	
	startTyping(channelID) {
		let options = {
    		method: 'POST',
			uri: `${url}/channels/${channelID}/typing`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};
		return requestp(options)	
	}
	
	moveGuildMember(serverID, channelID, userID) {
        let HTTPoptions = {
            method: 'PATCH',
            uri: `${url}/guilds/${serverID}/members/${userID}`,
            body: {
                "channel_id": channelID
            },
            headers: {
                'Authorization': `Bot ${this.token}`
            },
            json: true
        };
        request(HTTPoptions, (err, httpResponse, body) => {
        	if (err) { 
        		return new Promise.reject(new Error("That user is not in a voice channel!"))
        	} else {
        		return Promise.resolve('wss://gateway.discord.gg/');
        	}
        })	
	}
	
	getInvite(invitecode) {
		let options = {
    		method: 'GET',
			uri: `${url}/invites/${invitecode}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	// return new Promise.reject(new Error("You don't have test invite!"));
		return requestp(options).then((invite) => { return invite; }).catch(function (err) { return new Promise.reject(new Error("You don't have test invite!")); });
	}
	
	getGuildInvites(serverID) {
		let options = {
    		method: 'GET',
			uri: `${url}/guilds/${serverID}/invites`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	// return new Promise.reject(new Error("You don't have test invite!"));
		return requestp(options).then((inviteArray) => { return inviteArray; }).catch(function (err) { return new Promise.reject(new Error("You don't have test invites")); });
	}
	getGuildBans(serverID) {
		let options = {
    		method: 'GET',
			uri: `${url}/guilds/${serverID}/bans`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	// return new Promise.reject(new Error("You don't have test invite!"));
		return requestp(options).then((userArray) => { return userArray; }).catch(function (err) { return new Promise.reject(new Error("You don't have test bans")); });
	}
	
	getGuildRoles(serverID) {
		let options = {
    		method: 'GET',
			uri: `${url}/guilds/${serverID}/roles`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	// return new Promise.reject(new Error("You don't have test invite!"));
		return requestp(options).then((roleArray) => { return roleArray; }).catch(function (err) { return new Promise.reject(new Error("You don't have test roles!")); });
	}
	
	unbanUser(serverID, userID) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/guilds/${serverID}/bans/${userID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to unban user")); });
	}
	
	banUser(serverID, userID) {
        let HTTPoptions = {
            method: 'PUT',
            uri: `${url}/guilds/${serverID}/bans/${userID}`,
            headers: {
                'Authorization': `Bot ${this.token}`
            },
            json: true
        };
        request(HTTPoptions, (err, httpResponse, body) => {
        	if (err) { 
        		return new Promise.reject(new Error("That user is not in a voice channel!"))
        	} else {
        		return new Promise.resolve('wss://gateway.discord.gg/');
        	}
        })	
	}

	getChannel(channelID) {
		let options = {
    		method: 'GET',
			uri: `${url}/channels/${channelID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).then((channel) => { return channel; }).catch(function (err) { return new Promise.reject(new Error("You don't have test channel")); });
	}
	
    changeGuild(serverID, name, region, icon, owner_id) {
        let HTTPoptions = {
            method: 'PATCH',
            uri: `${url}/guilds/${serverID}`,
            body: {
                "name": name,
                "region": region,
                "icon": icon,
                "owner_id": owner_id
            },
            headers: {
                'Authorization': `Bot ${this.token}`
            },
            json: true
        };
        request(HTTPoptions, (err, httpResponse, body) => {
        	if (err) { 
        		return new Promise.reject(new Error("You don't have permission to create role!"))
        	} else {
        		return Promise.resolve('wss://gateway.discord.gg/');
        	}
        })
    }
    
	getGuild(serverID) {
		let options = {
    		method: 'GET',
			uri: `${url}/guilds/${serverID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).then((guild) => { return guild; }).catch(function (err) { return new Promise.reject(new Error("You don't have test channel")); });
	}
	snipGuild(serverID) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/guilds/${serverID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("You don't have permission to delete this guild!!")); });
	}
	
	changeChannel(channelID, name, position, topic, bitrate, user_limit) {
        let HTTPoptions = {
            method: 'PATCH',
            uri: `${url}/channels/${channelID}`,
            body: {
            	"name": name,
            	"position": position,
            	"topic": topic,
            	"bitrate": bitrate,
            	"user_limit": user_limit
            },
            headers: {
                'Authorization': `Bot ${this.token}`
            },
            json: true
        };
        request(HTTPoptions, (err, httpResponse, body) => {
        	if (err) { 
        		return new Promise.reject(new Error("You don't have permission to create role!"))
        	} else {
        		return Promise.resolve('wss://gateway.discord.gg/');
        	}
        })
    }
    
	leaveGuild(serverID) {
		let options = {
    		method: 'DELETE',
			uri: `${url}/users/@me/guilds/${serverID}`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};	
		return requestp(options).catch(function (err) { return new Promise.reject(new Error("Somehow an error was made!")); });
	}
	changeStatus(status, botGame) {
	    ws.send(JSON.stringify({
		    op: 3,
		    d: {
		    	"status": status,
		    	"since": (status === 'idle') ? Date.now() : 0,
		    	"game": {
		    	    "name": botGame
		    	},
		    	"afk": status === 'idle'
		    }
        }))
	}
	
	get self() {
		let options = {
    		method: 'GET',
			uri: `${url}/users/@me`,
    		headers: {
        		'Authorization': `Bot ${this.token}`
    		}
		};
		return requestp(options).then((user) => { return this}).catch(function (err) { return new Promise.reject(new Error("Could not GET user information!")); });
	}
    changeSelf(username, avatar) {
        var base64data = new Buffer(fs.readFileSync(avatar)).toString('base64');
        let HTTPSoptions = {
            uri: `${url}/users/@me`,
            body: {
                "username": username,
                "avatar": `data:image/jpeg;base64,${base64data}` // i would of used this :eyes:
            },
            headers: {
                'Authorization': `Bot ${this.token}`
            },
            json: true // works for PATCH too
        };
        request.patch(HTTPSoptions, (err, httpResponse, body) => {
        	if (err) { 
        		return new Promise.reject(new Error("Odd error"))
        	} else {
        		return Promise.resolve();
        	}
        })
    }
    
}

ws.on('close', console.log);
module.exports = Client;