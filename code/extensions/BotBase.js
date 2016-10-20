"use strict";
const Client = require("../Client");
const Message = require(".././structs/Message")

const WebSocket = require("ws"), request = require('request'), Zlib = require("zlib"), requestp = require('request-promise-any'), fs = require('fs'), opusscript = require("opusscript");
const ws = new WebSocket('wss://gateway.discord.gg/?v=6')
var url = ("https://discordapp.com/api")

var EventEmitter, Promise;
EventEmitter = require("events").EventEmitter;
try {
    Promise = require("bluebird");
} catch(err) {
    Promise = global.Promise;
}

class botBase extends EventEmitter {
    constructor(token, prefix, botName, ownerID) {
        super();
        
        if (!token) { return new Error("There is no token provided!") }
        if (!prefix) { return new Error("There is no prefix provided!") }
        if (!botName) { return new Error("There is no name for the bot provided!") }
        if (!ownerID) { return new Error("There is no owner id provided!") }
        
        this.token = token;
        this.prefix = prefix;
        this.name = botName;
        this.owner = ownerID;
    }
    
	createMessage(channelID, content) {
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
        		'Authorization': this.token
    		}
		};
		return requestp(options).then((message) => { new Message(message, this) }).catch(function (err) { console.log("COULD NOT UTILIZE [BotBase] EXTENSION\n\n" + err) });
	}
    
    connect() {
		ws.on('open', () => {
    		
		});
		
		
		ws.on("message", (data, flags) => {
		    var self = this;
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
                    	console.log("Bot Framework is Ready!\nUsing prefix: " + this.prefix + "\nDo " + this.prefix + "help\nmade by nekonez 2016")
                    break;
                    case "MESSAGE_CREATE":
                    	let msg = message.d
                    	if (msg.content.toLowerCase().startsWith(`${this.prefix}help`)) {
                    	    self.createMessage(msg.channel_id, `**${this.name}** - Using BotBase [discord.htc Extension]`)
                    	}
                    	if (msg.author.id === this.owner) {
                    	        if (msg.content.toLowerCase().startsWith(`${this.prefix}eval `)) {
                                    let args = msg.content.split(`${this.prefix}eval `).join("")
                                    try {
                                        var evald = eval(args);
                                        self.createMessage(msg.channel_id, `${"```js\n"}input: ${args}\n\noutput: ${evald}${"\n```"}`)
                                    } catch (e) { self.createMessage(msg.channel_id, `${"```js\n"}input: ${args}\n\noutput: ${e}${"\n```"}`) }
                                }
                    	} else {}
                    break;
                    }
            }
		});
    }
                    
}

module.exports = botBase;