const DHTC = require('discord.htc')
var bot = new DHTC('insert your token here idiot')
var prefix = "!"

//Log to console when our bot is ready
bot.on('botReady', () => {
  console.log('Ready!')
})

bot.on('createdMessage', (message) => {
  let args = m.split(" "); //for the suffix/end of the message
  var actualArgs = args[1];

  if (m.startsWith(`${prefix}repeat`)) { //message sent -> check if it matches the prefix + command
    bot.makeMessage(message.channel_id, "INSERT BOT NAME HERE : " + actualArgs)
  }
})

bot.connect()
