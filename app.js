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
    let soruchan = parsbot.channels.find("name", "soru-sor");

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
                .addField('Mesaj Gönderme', 'Kullanımı: !yaz,metin')
                .addField('Soru Ekle', 'Kullanımı: !soruekle, soru metni, cevap metni ')
                .addField('Soruları Listele', 'Kullanımı: !sorulistele')
                .addField('Soru Sil', 'Kullanımı: !sorusil,soruid')
                .addField('Soruların Tümünü Sil', 'Kullanımı: !sorusilall')
                .addField('Soru Sor', 'Kullanımı: !sorusor,soruid')
                .addField('Zaman Ayarlı Soru Sor (Soruyu .. dakika sonra gönderir)', 'Kullanımı: !zsorusor,soruid,kaç dakika sonra sorulacağı')
                .addField('Kazanan Belirle', 'Kullanımı: !kazbel,soruid,kazanan kullanıcı adı')
                .addField('Manuel Kazanan Belirle', 'Kullanımı: !mkazbel,soru metni,cevap metni,kazanan kullanıcı adı')
                .addField('Skor Tablosu', 'Kullanımı: !skor')
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
                        if(questiondata.questions[i]!=null){
                            embed.addField('Soru id: ' + i, 'Soru: ' + questiondata.questions[i].soru + ' Cevap: ' + questiondata.questions[i].cevap + ' Ekleyen Kullanıcı: ' + questiondata.questions[i].ekleyenkullanici);
                        }
                    }
                }else{
                    embed.addField(" Şu an eklenmiş bir soru bulunmaktadır."," !soruekle, soru metni, cevap metni şeklinde yeni soru ekleyebilirsiniz")
                }
                message.channel.send(embed);
        }
    } // list question command end

    else if (msg.startsWith(prefix + 'sorusilall')) { // delete all questions command start
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
    } // delete all questions command end

    else if (msg.startsWith(prefix + 'sorusil')) { // delete question command start
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name)))
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            writeLog("Soru Silme");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined" || !args[0].match(/^-{0,1}\d+$/)) // question id control
            {
                message.channel.send(sender + " Lütfen soru'idsini giriniz (!sorulistele ile öğrenebilirsiniz) Örnek: !sorusil,0")
            }
            else{
            if(deleteQuestion(args[0].trim()))
                {
                    message.channel.send(sender + " soru başarıyla silindi")
                }
            }
        }
    } // delete question command end

    else if (msg.startsWith(prefix + 'sorusor')) { // send question command start
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name)))
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            writeLog("Soru Sor");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined" || !args[0].match(/^-{0,1}\d+$/)) // question id control
            {
                message.channel.send(sender + " Lütfen soru'idsini giriniz (!sorulistele ile öğrenebilirsiniz) Örnek: !sorusor,0")
            }
            else{
                    if(soruchan) { // write question to question channel
                        let json = listQuestions();
                        if(json.questions[(args[0].trim())] != null){
                            let help_image = "https://i.imgsafe.org/5c/5c35c8adf3.png";
                            let color = "1C8ADB";
                            const embed = new Discord.RichEmbed()
                            .setThumbnail(help_image)
                            .setColor(color)
                            .addField('Soru:',json.questions[(args[0].trim())].soru)
                            soruchan.send(embed);
                            message.channel.send(sender + " soru gönderimi başarılı")
                        }
                        else{
                            message.channel.send(sender + " soru gönderimi başarısız")
                        }
                    }
                    else{
                        message.channel.send(sender + " soru gönderimi başarısız")
                    }
            }
        }
    } // send question command end

    else if (msg.startsWith(prefix + 'zsorusor')) { // send question with delay command start
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name)))
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            writeLog("Beklemeli Soru Sor");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined" || !args[0].match(/^-{0,1}\d+$/)) // question id control
            {
                message.channel.send(sender + " Lütfen soru'idsini giriniz (!sorulistele ile öğrenebilirsiniz) Örnek: !zsorusor,0,5")
            }
            else if(typeof args[1] === "undefined" || !args[1].match(/^-{0,1}\d+$/)) // delay time control
            {
                message.channel.send(sender + " Lütfen dakika cinsinden bekleme süresini giriniz Örnek: !zsorusor,0,1")
            }
            else{
                    if(soruchan) { // write question to question channel
                        let json = listQuestions();
                        if(json.questions[(args[0].trim())] != null){
                            setTimeout(function() {
                            let help_image = "https://i.imgsafe.org/5c/5c35c8adf3.png";
                            let color = "1C8ADB";
                            const embed = new Discord.RichEmbed()
                            .setThumbnail(help_image)
                            .setColor(color)
                            .addField('Soru:',json.questions[(args[0].trim())].soru)
                            soruchan.send(embed);
                        }, args[1] * 60000);
                            message.channel.send(sender + " soru gönderimi başarılı, sorunuz " + args[1] +" dakika sonra gönderilecektir.")
                        }
                        else{
                            message.channel.send(sender + " soru gönderimi başarısız")
                        }
                    }
                    else{
                        message.channel.send(sender + " soru gönderimi başarısız")
                    }
            }
        }
    } // send question with delay command end

    else if (msg.startsWith(prefix + 'kazbel')) { // determine the winner command start
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name)))
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            writeLog("Kazanan Belirleme");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined" || !args[0].match(/^-{0,1}\d+$/)) // question id control
            {
                message.channel.send(sender + " Lütfen soru'idsini giriniz (!sorulistele ile öğrenebilirsiniz) Örnek: !sorulistele")
            }
            else if(typeof args[1] === "undefined") // username control
            {
                message.channel.send(sender + " Lütfen kazanan kullanıcı adını giriniz Örnek: !kazbel,0,pars11")
            }
            else{
                    if(soruchan) { // write winner to question channel
                        let json = listQuestions();
                        if(json.questions[(args[0].trim())] != null){
                            addWinner(args[1].trim());
                            let win_image = "https://i.imgsafe.org/bd/bd4ab251f6.png";
                            let color = "F5C92C";
                            const embed = new Discord.RichEmbed()
                            .setThumbnail(win_image)
                            .setColor(color)
                            .setAuthor("Tebrikler")
                            .addField('Kazanan Kullanıcı:',args[1].trim())
                            .addField('Soru:',json.questions[(args[0].trim())].soru)
                            .addField('Cevap:',json.questions[(args[0].trim())].cevap)
                            soruchan.send(embed);
                            message.channel.send(sender + " kazanan belirleme başarılı.")
                        }
                        else{
                            message.channel.send(sender + " kazanan belirleme başarısız")
                        }
                    }
                    else{
                        message.channel.send(sender + " kazanan belirleme başarısız")
                    }
            }
        }
    } // determine the winner command end

    else if (msg.startsWith(prefix + 'mkazbel')) { // determine the winner manuel command start
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name)))
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            writeLog("Kazanan Belirleme");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined") // question id control
            {
                message.channel.send(sender + " Lütfen soru metnini giriniz Örnek: !mkazbel,sorumetni,cevapmetni,kullanıcı adı")
            }
            else if(typeof args[1] === "undefined") // username control
            {
                message.channel.send(sender + " Lütfen cevap metnini giriniz Örnek: !mkazbel,sorumetni,cevapmetni,kullanıcı adı")
            }
            else if(typeof args[2] === "undefined") // username control
            {
                message.channel.send(sender + " Lütfen kazanan kullanıcı adını giriniz Örnek: !mkazbel,sorumetni,cevapmetni,kullanıcı adı")
            }
            else{
                    if(soruchan) { // write winner manuel to question channel
                        let json = listQuestions();
                        if(args[0].trim() != null){
                            addWinner(args[2].trim());
                            let win_image = "https://i.imgsafe.org/bd/bd4ab251f6.png";
                            let color = "F5C92C";
                            const embed = new Discord.RichEmbed()
                            .setThumbnail(win_image)
                            .setColor(color)
                            .setAuthor("Tebrikler")
                            .addField('Kazanan Kullanıcı:',args[2].trim())
                            .addField('Soru:',args[0].trim())
                            .addField('Cevap:',args[1].trim())
                            soruchan.send(embed);
                            message.channel.send(sender + " kazanan belirleme başarılı.")
                        }
                        else{
                            message.channel.send(sender + " kazanan belirleme başarısız")
                        }
                    }
                    else{
                        message.channel.send(sender + " kazanan belirleme başarısız")
                    }
            }
        }
    } // determine the winner manuel command end

    else if (msg.startsWith(prefix + 'yaz')) { // send message command start
        if(!message.member.roles.find(r=>["Parsbot"].includes(r.name)))
        {
            message.channel.send(sender + " botu kullanım yetkiniz yok")
        }
        else
        {
            writeLog("Mesaj Gönderme");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined") // message control
            {
                message.channel.send(sender + " Lütfen mesajınızı giriniz Örnek: !yaz,Arkadaşlar bugün 3 soru sorulacaktır.")
            }
            else{
                    if(soruchan) { // write message to question channel
                        if(args[0].trim() != null){
                            soruchan.send(args[0].trim());
                            message.channel.send(sender + " mesaj gönderimi başarılı")
                        }
                        else{
                            message.channel.send(sender + " mesaj gönderimi başarısız")
                        }
                    }
                    else{
                        message.channel.send(sender + " mesaj gönderimi başarısız")
                    }
            }
        }
    } // send message command end

    else if (msg.startsWith(prefix + 'skor')) { // score board command start
        if(soruchan) {
            writeLog("Skor Görüntüleme");
            // command process
            let win_image = "https://i.imgsafe.org/bd/bd4ab251f6.png";
            let color = "F5C92C";
            const embed = new Discord.RichEmbed()
                .setThumbnail(win_image)
                .setColor(color)
                .setAuthor('Skor Listesi | TOP 10:')

                let winnerdata = listWinners(); // get winners
                let data = sortProperties(winnerdata.winners,"score",true,true);
                let count = data.length;
                if(count!=0){
                    for (i = 0; i < 10; i++) { // write winners to embed
                        if(data[i][1]!=null){
                            embed.addField('Sıra: ' + (i+1), 'Kullanıcı: ' + data[i][1].user + ' Skor: ' + data[i][1].score);
                        }
                    }
                }else{
                    embed.addField(" Üzgünüz","  Sistemde şu an kazanan kullanıcı bulunmamaktadır.")
                }
                message.channel.send(embed); // send embed to message channel
        }
    } // score board command end
    
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

    function addWinner(username) // Add winner to winners.json
    {
        let winner = {  // winner data
            user: username,
            score: 1
        };
        var control=false;
        fs.readFile('winners.json', function (err, data) {
            var json = JSON.parse(data);
            for (var i=0; i<json.winners.length; i++){
                if(json.winners[i].user == username){
                    json.winners[i].score+=1;
                    control=true;
                    break;
                }
            }
        if(control==false || json.winners.length==0)
        {
            json.winners.push(winner);
        }
            fs.writeFile("winners.json", JSON.stringify(json), function(err){
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

    function listWinners(){ // List all winners / return winners json
        let  data = fs.readFileSync('winners.json');
            let json= JSON.parse(data);
            return json;
    }

    function sortProperties(obj, sortedBy, isNumericSort, reverse) { // object sort function
        sortedBy = sortedBy || 1; // by default first key
        isNumericSort = isNumericSort || false; // by default text sort
        reverse = reverse || false; // by default no reverse

        var reversed = (reverse) ? -1 : 1;

        var sortable = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                sortable.push([key, obj[key]]);
            }
        }
        if (isNumericSort)
            sortable.sort(function (a, b) {
                return reversed * (a[1][sortedBy] - b[1][sortedBy]);
            });
        else
            sortable.sort(function (a, b) {
                var x = a[1][sortedBy].toLowerCase(),
                    y = b[1][sortedBy].toLowerCase();
                return x < y ? reversed * -1 : x > y ? reversed : 0;
            });
        return sortable;
    }

    function deleteQuestion(id){ // Delete all questions/ open new questions object
        fs.readFile('questions.json', function (err, data) {
            var json = JSON.parse(data);
            json.questions[id] = undefined; // question[id] set null
            var json2 = {"questions":[]} // clean json
            for (var i=0; i<json.questions.length; i++){ // clear null
                if(json.questions[i] != null){
                    json2.questions.push(json.questions[i])
                }
            }
            fs.writeFile("questions.json", JSON.stringify(json2), function(err){ // write clean json to questions.json
            if (err) throw err;
            });
        });
        return true;
    }

    function deleteAllQuestions(){ // Delete all questions/ open new questions object
        let json = {"questions":[]}
        fs.writeFile("questions.json", JSON.stringify(json), function(err){
            if (err) throw err;
            });
        return true;
    }

}); // message end

//IMAGE SOURCES :pixabay.com