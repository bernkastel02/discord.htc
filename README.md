<p align="center">
    <img src="https://cdn.discordapp.com/attachments/216763379535052801/234375516742746112/Untitled-1.png" alt="discord.htc logo">
<a href="https://travis-ci.org/nekonez/discord.htc"><img src="https://travis-ci.org/nekonez/discord.htc.svg?branch=master"></a>
<br>
<a href="https://nodei.co/npm/discord.htc/"><img src="https://nodei.co/npm/discord.htc.png?downloads=true&downloadRank=true&stars=true"></a>
<br>

<a href="https://www.npmjs.com/package/discord.htc"><img src="https://img.shields.io/npm/v/discord.htc.svg?style=flat-square" alt="npm version" height="18"></a> <a  href="https://david-dm.org/nekonez/discord.htc"><img src="https://david-dm.org/nekonez/discord.htc.svg" alt="david"></a>
<br>
</p>


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

##Discord Server

https://discord.gg/hbKjYTu

##NPM Package

https://www.npmjs.com/package/discord.htc
