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
    let args = msg.split(",");
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
                .addField('Soru Ekle', 'Kullanımı: !soruekle, soru metni, cevap metni ')
                .addField('Soruları Listele', 'Kullanımı: !sorulistele')
                .addField('Soruların Tümünü Sil', 'Kullanımı: !sorusilall')
                message.channel.send(embed);
        }
    } // help command end

    else if (msg.startsWith(prefix + 'soruekle')) { // add question command start
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name)))
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            args.shift() // delete the command text
            if(typeof args[0] === "undefined") // question text control
            {
                message.channel.send(sender + " Lütfen soruyu ve cevabını giriniz")
            }
            else if(typeof args[1] === "undefined") // answer text control
            {
                message.channel.send(sender + " Lütfen sorunun cevabını giriniz")
            }
            else{
                writeLog("Soru Ekleme"); // write log
                if(writeQuestion(args[0],args[1])) // add question questions.json file
                {
                    message.channel.send(sender + " Soru ekleme başarılı")
                }
            }
        }
    } // add question command end

    else if (msg.startsWith(prefix + 'sorulistele')) { // list question command start
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name)))
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            writeLog("Soru Listeleme");
            // command process
            let help_image = "https://i.imgsafe.org/5c/5c35c8adf3.png";
            let color = "DB4545";
            const embed = new Discord.RichEmbed()
                .setThumbnail(help_image)
                .setColor(color)
                .setAuthor('Sorular:')

                let questiondata = listQuestions(); // get questions
                let count = Object.keys(questiondata.questions).length;
                if(count!=0){
                    for (i = 0; i < count; i++) { // add questions
                        embed.addField('Soru id: ' + i, 'Soru: ' + questiondata.questions[i].soru + ' Cevap: ' + questiondata.questions[i].cevap + ' Ekleyen Kullanıcı: ' + questiondata.questions[i].ekleyenkullanici);
                    }
                }else{
                    embed.addField(" Şu an eklenmiş bir soru bulunmaktadır."," !soruekle, soru metni, cevap metni şeklinde yeni soru ekleyebilirsiniz")
                }
                message.channel.send(embed);
        }
    } // list question command end

    else if (msg.startsWith(prefix + 'sorusilall')) { // delete questions command start
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name)))
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            writeLog("Soruların Tümünü Sil");
            // command process
            if(deleteAllQuestions())
                {
                    message.channel.send(sender + " Soruların tümü başarıyla silindi")
                }
        }
    } // delete questions command end
    
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

        fs.readFile('logs.json', function (err, data) { // write log to logs.json
            var json = JSON.parse(data);
            json.logs.push(log);    
            fs.writeFile("logs.json", JSON.stringify(json), function(err){
            if (err) throw err;
            });
        }); 
    }

    function writeQuestion(question,answer) // Add question to questions.json
    {
        let soru = {  // question data
            soru: question,
            cevap: answer,
            ekleyenkullanici: sender.username,
        };

        fs.readFile('questions.json', function (err, data) {
            var json = JSON.parse(data);
            json.questions.push(soru);    
            fs.writeFile("questions.json", JSON.stringify(json), function(err){
            if (err) throw err;
            });
        });
        return true;
    }

    function listQuestions(){ // List all questions / return questions json
        let  data = fs.readFileSync('questions.json');
            let json= JSON.parse(data);
            return json;
    }

    function deleteAllQuestions(){ // Delete all questions/ open new questions object
        let json = {"questions":[]}
        fs.writeFile("questions.json", JSON.stringify(json), function(err){
            if (err) throw err;
            });
        return true;
    }

}); // message end