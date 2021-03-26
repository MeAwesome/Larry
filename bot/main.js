const Discord = require("discord.js");
const botConfig = require("./config/config.json");
const Commands = require("./commands.js");
const bot = new Discord.Client();
var BOT_TOKEN;

if (process.env.PORT == undefined){
    BOT_TOKEN = require("./config/token.json");
}

bot.once("ready", () => {
    bot.user.setPresence({
        status:"online",
        activity: {
            name: 'all of you :)',
            type: "WATCHING"
        }
    });
    console.log("Larry Is Ready");
});

bot.once("reconnecting", () => {
    console.log("Larry Is Reconnecting");
});

bot.once("disconnect", () => {
    console.log("Larry Died");
});

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(botConfig.prefix)) return;

    var args = message.content.toLowerCase().split(" ");
    var command = args.shift().substring(botConfig.prefix.length);

    if(Commands.hasOwnProperty(command)) Commands[command].run(message, command, args);
});

bot.login(process.env.BOT_TOKEN || BOT_TOKEN.token);