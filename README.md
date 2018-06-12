# qaDiscordbot
Question answer discord bot

#### What is the project about?
Qabot is a question&answer bot that discord channel managers can use to make question,answer competitions. Once the administrators have added their questions, they can ask they want and then determine the winners.

Bot has role control for each command and only those with role (now qabot) can use the bot. (Score Board and Statistics do not have role control)

The bot keeps a log for each command. This log record is saved both to the log channel and to the local log file of the bot. 

At the same time, users can see the "top 10 user" with score command. Or they can look at the number of question added,asked and winning user count with statistics command.

<hr>

**Commands:**

![comm](https://i.imgsafe.org/fd/fd7af98efa.png)

**Send message**

![sendmessage1.png](https://ipfs.busy.org/ipfs/Qmajm5XtgWCPLZeJKNgiGtFniiPnMDvqwYRsqbrqSgzurE)

* Question channel
![sendmessage2.png](https://ipfs.busy.org/ipfs/QmPKZALy3w8twegedS7cn5q5hmHdkj3DpZShSUA1gPkBxV)

**List Questions**
![list](https://i.imgsafe.org/fd/fd81642047.png)

**Send Question / Determine Winner**
![qa](https://i.imgsafe.org/fd/fd84572a98.png)

**Log Channel**

![log](https://i.imgsafe.org/fd/fdaae6fca8.png)

**Score Board**

![score](https://i.imgsafe.org/fd/fdad11e8e5.png)

**Statistics**

![stat](https://i.imgsafe.org/fd/fdb24974e2.png)

<hr>

#### Technology Stack
* [Discord.js](https://discord.js.org/#/)
* [File system](https://www.npmjs.com/package/file-system) (for read and write json)
* [Moment.js](https://momentjs.com)

#### Roadmap
I will determine the remaining updates according to the comments and responses. I can edit and update it according to the users' requests.

#### Install
Firstly we need to download and install Node.js from [Node.js Website](https://nodejs.org/en/download/).

After installing node.js, you can download qabot via github or clone your computer.

Clone:

> cd projectfolder

> git clone https://github.com/pars11/qaDiscordbot

You need to enter your bot token in the "qabot.login('');" section in the app.js file.

More info discord app and bot token. [Parsbot | Discord Bot Tutorial Node.js | Part 1](https://steemit.com/utopian-io/@pars11/parsbot-or-discord-bot-tutorial-node-js-or-part-1)

Okey now run app with node.

> node app.js

#### How to contribute?
You can reach me by commenting on this post or send message on the discord (@pars11#1145). If you want to make this application better, you can make a Pull Request.
