const Discord = require('discord.js'); 
const fs = require('fs'); 
const moment = require('moment');
const prefix = '!'; // message prefix
const qabot = new Discord.Client();

qabot.login(''); // discord token login

qabot.on('ready', () => { // ready control
    console.log('Qabot started')
});

qabot.on('message', message => { // get messages

    let msg = message.content;
    let msgUpper = message.content.toUpperCase();
    let sender = message.author;
    let args = msg.split(",");
    let today = moment(Date.now());
    let logchan = qabot.channels.find("name", "qabot-log");
    let questionchan = qabot.channels.find("name", "ask-question");

    if (msgUpper === prefix + 'HELP') { // help command start 
        if(!message.member.roles.find(r=>["qabot"].includes(r.name))) // role control
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            writeLog("Help command"); // write log function

            // command process
            let color = "1C8ADB";
            const embed = new Discord.RichEmbed() // define embed and send
                .setColor(color)
                .setAuthor('Commands:')
                .addField('Send Message', 'Use of: !send,text')
                .addField('Add question', 'Use of: !addquestion, question text, answer text ')
                .addField('List questions', 'Use of: !listquestions')
                .addField('Delete question', 'Use of: !deletequestion,questionid')
                .addField('Delete All Questions', 'Use of: !deletequestionsall')
                .addField('Ask Question', 'Use of: !askquestion,questionid')
                .addField('Ask a delayed question (Send the question in .. minutes)', 'Use of: !daskquestion,questionid,delay(minute)')
                .addField('Determine the winner', 'Use of: !detwin,questionid,winner username')
                .addField('Manual Determine the winner', 'Use of: !mdetwin,question text,answer text,winner username')
                .addField('Score Board', 'Use of: !score (For users)')
                .addField('Statistics', 'Use of: !statistics (For users)')
                message.channel.send(embed);
        }
    } // help command end

    else if (msg.startsWith(prefix + 'addquestion')) { // add question command start
        if(!message.member.roles.find(r=>["qabot"].includes(r.name)))
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            args.shift() // delete the command text
            if(typeof args[0] === "undefined") // question text control
            {
                message.channel.send(sender + " please enter your question and answer")
            }
            else if(typeof args[1] === "undefined") // answer text control
            {
                message.channel.send(sender + " please enter the answer to your question")
            }
            else{
                writeLog("Add Question"); // write log
                if(writeQuestion(args[0],args[1])) // add question questions.json file
                {
                    message.channel.send(sender + " question successfully added")
                }
            }
        }
    } // add question command end

    else if (msg.startsWith(prefix + 'listquestions')) { // list question command start
        if(!message.member.roles.find(r=>["qabot"].includes(r.name)))
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            writeLog("List Question");
            // command process
            let color = "DB4545";
            const embed = new Discord.RichEmbed()
                .setColor(color)
                .setAuthor('Questions:')

                let questiondata = listJson("questions.json"); // get questions
                let count = Object.keys(questiondata.questions).length;
                if(count!=0){
                    for (i = 0; i < count; i++) { // add questions
                        if(questiondata.questions[i]!=null){
                            embed.addField('Question id: ' + i, 'Question: ' + questiondata.questions[i].soru + ' Answer: ' + questiondata.questions[i].cevap + ' Submitted by: ' + questiondata.questions[i].ekleyenkullanici);
                        }
                    }
                }else{
                    embed.addField(" there is no question right now."," use the !addquestion,question text,answer text command to add a new question.")
                }
                message.channel.send(embed);
        }
    } // list question command end

    else if (msg.startsWith(prefix + 'deletequestionsall')) { // delete all questions command start
        if(!message.member.roles.find(r=>["qabot"].includes(r.name)))
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            writeLog("Delete All Questions");
            // command process
            if(deleteAllQuestions())
                {
                    message.channel.send(sender + " successfully deleted all questions")
                }
        }
    } // delete all questions command end

    else if (msg.startsWith(prefix + 'deletequestion')) { // delete question command start
        if(!message.member.roles.find(r=>["qabot"].includes(r.name)))
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            writeLog("Delete Question");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined" || !args[0].match(/^-{0,1}\d+$/)) // question id control
            {
                message.channel.send(sender + " please enter question id (!listquestions command) Example: !deletequestion,0")
            }
            else{
            if(deleteQuestion(args[0].trim()))
                {
                    message.channel.send(sender + " question successfully deleted")
                }
            }
        }
    } // delete question command end

    else if (msg.startsWith(prefix + 'askquestion')) { // send question command start
        if(!message.member.roles.find(r=>["qabot"].includes(r.name)))
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            writeLog("Ask Question");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined" || !args[0].match(/^-{0,1}\d+$/)) // question id control
            {
                message.channel.send(sender + " please enter question id (!listquestions command) Example: !askquestion,0")
            }
            else{
                    if(questionchan) { // write question to question channel
                        let json = listJson("questions.json");
                        if(json.questions[(args[0].trim())] != null){
                            let color = "1C8ADB";
                            const embed = new Discord.RichEmbed()
                            .setColor(color)
                            .addField('Question:',json.questions[(args[0].trim())].soru)
                            questionchan.send(embed);
                            message.channel.send(sender + " the question has been successfully sent")
                        }
                        else{
                            message.channel.send(sender + " failed to send question")
                        }
                    }
                    else{
                        message.channel.send(sender + " failed to send question")
                    }
            }
        }
    } // send question command end

    else if (msg.startsWith(prefix + 'daskquestion')) { // send question with delay command start
        if(!message.member.roles.find(r=>["qabot"].includes(r.name)))
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            writeLog("Ask a delayed question");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined" || !args[0].match(/^-{0,1}\d+$/)) // question id control
            {
                message.channel.send(sender + " please enter question id (!listquestions command) Example: !daskquestion,0,5")
            }
            else if(typeof args[1] === "undefined" || !args[1].match(/^-{0,1}\d+$/)) // delay time control
            {
                message.channel.send(sender + " please enter the delay time in minutes Example: !daskquestion,0,1")
            }
            else{
                    if(questionchan) { // write question to question channel
                        let json = listJson("questions.json");
                        if(json.questions[(args[0].trim())] != null){
                            setTimeout(function() {
                            let color = "1C8ADB";
                            const embed = new Discord.RichEmbed()
                            .setColor(color)
                            .addField('Question:',json.questions[(args[0].trim())].soru)
                            questionchan.send(embed);
                        }, args[1] * 60000);
                            message.channel.send(sender + " the question has been successfully sent, your question will be sent out in " + args[1] +" minutes.")
                        }
                        else{
                            message.channel.send(sender + " failed to send question")
                        }
                    }
                    else{
                        message.channel.send(sender + " failed to send question")
                    }
            }
        }
    } // send question with delay command end

    else if (msg.startsWith(prefix + 'detwin')) { // determine the winner command start
        if(!message.member.roles.find(r=>["qabot"].includes(r.name)))
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            writeLog("Determine the winner");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined" || !args[0].match(/^-{0,1}\d+$/)) // question id control
            {
                message.channel.send(sender + " please enter question id (!listquestions command) Example: !listquestions")
            }
            else if(typeof args[1] === "undefined") // username control
            {
                message.channel.send(sender + " please enter winner username Example: !detwin,0,pars11")
            }
            else{
                    if(questionchan) { // write winner to question channel
                        let json = listJson("questions.json");
                        if(json.questions[(args[0].trim())] != null){
                            addWinner(args[1].trim());
                            let color = "F5C92C";
                            const embed = new Discord.RichEmbed()
                            .setColor(color)
                            .setAuthor("Congratulations")
                            .addField('Winner Username:',args[1].trim())
                            .addField('Question:',json.questions[(args[0].trim())].soru)
                            .addField('Answer:',json.questions[(args[0].trim())].cevap)
                            questionchan.send(embed);
                            message.channel.send(sender + " winning determine is successful")
                        }
                        else{
                            message.channel.send(sender + " winning determine is failed")
                        }
                    }
                    else{
                        message.channel.send(sender + " winning determine is failed")
                    }
            }
        }
    } // determine the winner command end

    else if (msg.startsWith(prefix + 'mdetwin')) { // determine the winner manuel command start
        if(!message.member.roles.find(r=>["qabot"].includes(r.name)))
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            writeLog("Manual Determine the winner");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined") // question id control
            {
                message.channel.send(sender + " please enter the question text Example: !mdetwin,question text,answer text,username")
            }
            else if(typeof args[1] === "undefined") // username control
            {
                message.channel.send(sender + " please enter the answer text Example: !mdetwin,question text,answer text,username")
            }
            else if(typeof args[2] === "undefined") // username control
            {
                message.channel.send(sender + " please enter the winner username Example: !!mdetwin,question text,answer text,username")
            }
            else{
                    if(questionchan) { // write winner manuel to question channel
                        let json = listJson("questions.json");
                        if(args[0].trim() != null){
                            addWinner(args[2].trim());
                            let color = "F5C92C";
                            const embed = new Discord.RichEmbed()
                            .setColor(color)
                            .setAuthor("Congratulations")
                            .addField('Winner Username:',args[2].trim())
                            .addField('Question:',args[0].trim())
                            .addField('Answer:',args[1].trim())
                            questionchan.send(embed);
                            message.channel.send(sender + " winning determine is successful")
                        }
                        else{
                            message.channel.send(sender + " winning determine is failed")
                        }
                    }
                    else{
                        message.channel.send(sender + " winning determine is failed")
                    }
            }
        }
    } // determine the winner manuel command end

    else if (msg.startsWith(prefix + 'send')) { // send message command start
        if(!message.member.roles.find(r=>["qabot"].includes(r.name)))
        {
            message.channel.send(sender + " you do not have the role to use the bot")
        }
        else
        {
            writeLog("Send Message");
            // command process
            args.shift() // delete the command text
            if(typeof args[0] === "undefined") // message control
            {
                message.channel.send(sender + " please enter your message Example: !send,Hi Friends! Today we ask three question")
            }
            else{
                    if(questionchan) { // write message to question channel
                        if(args[0].trim() != null){
                            questionchan.send(args[0].trim());
                            message.channel.send(sender + " message sent successful")
                        }
                        else{
                            message.channel.send(sender + " failed to send message")
                        }
                    }
                    else{
                        message.channel.send(sender + " failed to send message")
                    }
            }
        }
    } // send message command end

    else if (msg.startsWith(prefix + 'score')) { // score board command start
        if(questionchan) {
            writeLog("Score Board");
            // command process
            let color = "F5C92C";
            const embed = new Discord.RichEmbed()
                .setColor(color)
                .setAuthor('Score Board | TOP 10:')

                let winnerdata = listJson("winners.json"); // get winners
                let data = sortProperties(winnerdata.winners,"score",true,true);
                let count = data.length;
                if(count!=0){
                    for (i = 0; i < 10; i++) { // write winners to embed
                        if(data[i]!=null){
                            embed.addField((i+1), 'Username: ' + data[i][1].user + ' Score: ' + data[i][1].score);
                        }
                    }
                }else{
                    embed.addField(" Sorry","  the system does not currently have a winning user")
                }
                message.channel.send(embed); // send embed to message channel
        }
    } // score board command end

    else if (msg.startsWith(prefix + 'statistics')) { // stats command start
        if(questionchan) {
            writeLog("Statistics");
            var addquestion=0,askquestion=0,detwinner=0;
            // command process
            let color = "38efab";
            const embed = new Discord.RichEmbed()
                .setColor(color)
                .setAuthor('Statistics:')
                let logsdata = listJson("logs.json"); // get logs
                let count = logsdata.logs.length;
                if(count!=0){
                    for (i = 0; i < count; i++) { // get count stats
                        if(logsdata.logs[i]!=null){
                            let islem = logsdata.logs[i].islem;
                            if (islem == "Add Question")
                            {
                                addquestion+=1;
                            }
                            else if(islem == "Ask Question" || islem == "Ask a delayed question")
                            {
                                askquestion+=1;
                            }
                            else if(islem == "Determine the winner" || islem == "Manual Determine the winner" )
                            {
                                detwinner+=1;
                            }
                        }
                    }
                    embed.addField('Number of Questions Added: ', addquestion);
                    embed.addField('Number of Questions Asked: ', askquestion);
                    embed.addField('Number of Winning Users: ', detwinner);
                }else{
                    embed.addField(" Sorry","  no statistics are currently available in the system")
                }
                message.channel.send(embed); // send embed to message channel
        }
    } // stats command end
    
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
            .addField('User:', log.kullanici)
            .addField('Datetime:', log.tarihvesaat)
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

    function listJson(jsonfile){ // List all json file /return json data
        let  data = fs.readFileSync(jsonfile);
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