<p align="center">
    <img src="https://cdn.discordapp.com/attachments/216763379535052801/234375516742746112/Untitled-1.png" alt="discord.htc logo">
##How to install

You will need node.js 4+ to run the library


####NPM Install Command

```
npm install discord.htc
```

or saving to your `package.json`...

```
npm install --save discord.htc
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
##Contributing
When contributing to the library, be it a direct commit or a pull request, please make sure that your code is formatted properly according to the [standard js](http://standardjs.com/) styleguide to keep consistancy throughout the library.

##Discord Server

https://discord.gg/hbKjYTu

##NPM Package

https://www.npmjs.com/package/discord.htc

