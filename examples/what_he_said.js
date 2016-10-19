const DHTC = require('discord.htc')
var bot = new DHTC('bot token')
var prefix = '!'

bot.on('botReady', () => {
  console.log('Ready!')
})

bot.on('createdMessage', (message) => {
  if (message.content.includes("^")) {
    bot.makeMessage(message.channel.id, 'Yeah! What he said!')
  }
})

bot.connect()
