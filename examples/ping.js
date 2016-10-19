const DHTC = require('discord.htc')
var bot = new DHTC('bot token')
var prefix = '!'

bot.on('botReady', () => {
  console.log('Ready!')
})

bot.on('createdMessage', (message) => {
  if (message.content.startsWith(`${prefix}ping`)) {
    bot.makeMessage(message.channel.id, 'Pong!')
  }
})

bot.connect()
