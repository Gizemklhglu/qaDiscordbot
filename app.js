const Discord = require('discord.js'); 
const prefix = '!'; // message prefix
const parsbot = new Discord.Client();

parsbot.login(''); // discord token login

parsbot.on('ready', () => { // ready control
    console.log('Parsbot started')
});

parsbot.on('message', message => { // get messages

    let msg = message.content;
    let msgUpper = message.content.toUpperCase();
    let sender = message.author;
    let args = msg.split(" ");

    if (msgUpper === prefix + 'YARDIM') { // help command
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name))) // role control
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
        var help_image = "https://i.imgsafe.org/5c/5c35c8adf3.png";
        const embed = new Discord.RichEmbed() // define embed and send
            .setThumbnail(help_image)
            .setColor(1C8ADB)
            .setAuthor('Komutlar:')
            .addField('Yardım', 'Kullanımı: !yardım')
            message.channel.send(embed);
        }
    }

});