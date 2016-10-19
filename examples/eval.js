var prefix = "!"
var ownerID = " "
var token = " "

// Do not touch code down here!
var DHTC = require('discord.htc')
var bot = new DHTC(token)
bot.on("botReady", (ready) => {
  console.log(ready)
});
 
bot.on("createdMessage", (message) => {
  if (message.author.id == (ownerID)) {
    if (message.content.toLowerCase().startsWith(`${prefix}eval `)) {
      let args = message.content.split(`${prefix}eval `).join("")
      try {
        var evald = eval(args);
        bot.makeMessage(message.channel.id, `${"```js\n"}input: ${args}\n\noutput: ${evald}${"\n```"}`)
      } catch (e) { bot.makeMessage(message.channel.id, `${"```js\n"}input: ${args}\n\noutput: ${e}${"\n```"}`) }
    }
  }
});
 
bot.connect();
