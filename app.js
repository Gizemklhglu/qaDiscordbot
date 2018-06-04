const Discord = require('discord.js'); 
const prefix = '!'; // message prefix
const parsbot = new Discord.Client();

parsbot.login(''); // discord token login

parsbot.on('ready', () => { // ready control
    console.log('Parsbot started')
});

parsbot.on('message', message => { // get messages



});