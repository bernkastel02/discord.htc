<p align="center">
    <img src="https://cdn.discordapp.com/attachments/216763379535052801/234375516742746112/Untitled-1.png" alt="discord.htc logo">
##How to install

You will need node.js 4+ to run the library


####Main Version

```
npm install discord.htc
```
####Development Version (MORE BUGS)

```
npm install nekonez/discord.htc#dev
```

###Ping Example

```js
const DHTC = require('discord.htc')
var bot = new DHTC('bot token')
var prefix = '!'

bot.on('botReady', () => {
  console.log('Ready!')
})

bot.on('createdMessage', (message) => {
  if (message.content.startsWith(`${prefix}ping`)) {
    bot.makeMessage(message.channel_id, 'pong')
  }
})

bot.connect()
```

##Progress on the Lib!

- [x] Client Struct
- [x] Message Struct
- [x] User Struct
- [x] Channel Struct
- [ ] Guild Struct

##Contributing
When contributing to the library, be it a direct commit or a pull request, please make sure that your code is formatted properly according to the [standard js](http://standardjs.com/) styleguide to keep consistancy throughout the library.

##Discord Server

https://discord.gg/hbKjYTu

###discord.htc &copy; TeamCoroX 2016
