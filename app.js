const Discord = require('discord.js'); 
const fs = require('fs'); 
const moment = require('moment');
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
    let today = moment(Date.now());
    let logchan = parsbot.channels.find("name", "parsbot-log");

    if (msgUpper === prefix + 'YARDIM') { // help command start 
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name))) // role control
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            writeLog("Yardım komutu"); // write log function

            // command process
            let help_image = "https://i.imgsafe.org/5c/5c35c8adf3.png";
            let color = "1C8ADB";
            const embed = new Discord.RichEmbed() // define embed and send
                .setThumbnail(help_image)
                .setColor(color)
                .setAuthor('Komutlar:')
                .addField('Yardım', 'Kullanımı: !yardım')
                message.channel.send(embed);
        }
    } // help command end


    function writeLog(islem) { 
        let log = {  // log data
            islem: islem,
            kullanici: sender.username,
            tarihvesaat:today.format("DD-MM-YYYY HH:mm")
        };

        if(logchan) { // write log to log channel
            let color = "6E185C";
            const embed = new Discord.RichEmbed()
            .setColor(color)
            .setAuthor(log.islem)
            .addField('Kullanıcı:', log.kullanici)
            .addField('Tarih ve Saat:', log.tarihvesaat)
            logchan.send(embed);
        }

        fs.readFile('data.json', function (err, data) { // write log to data.json
            var json = JSON.parse(data);
            json.logs.push(log);    
            fs.writeFile("data.json", JSON.stringify(json), function(err){
            if (err) throw err;
            });
        }); 
    }

}); // message end