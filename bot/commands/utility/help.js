const { prefix } = require('../../config.json');

const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Provides you with the commands list.",
    aliases:["commands"],
    usage:"[command name]",
    cooldown:0,
    execute(message, args){
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return message.channel.send(data, { split: true });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 0} second(s)`);

        message.channel.send(data, { split: true });



        /*var responce = new Discord.MessageEmbed().setColor("#000000");
        if (args.length == 0) {
            responce.setTitle("Command List")
                .setAuthor("Help With Larry", "./images/larry.png")
                .setDescription("View all of the available commands from Larry.")
                .setThumbnail("./images/larry.png")
                .addField(":video_game: Gaming", "'minecraft'")
                .addField(":wrench: Utility", "`help`, `image`, `website`")
                .addField(":gear: Settings", "`prefix`")
                .setFooter("To learn more about a specific command, run .help <command>.");
        } else {
            if (Commands.hasOwnProperty(args[0])) {
                responce.setTitle(args[0].charAt(0).toUpperCase() + args[0].slice(1))
                    .setAuthor("Help With Larry", "./images/larry.png")
                    .setDescription(this.config.description)
                    .setThumbnail("./images/larry.png")
                    .addField("Usage", "`" + Commands[args[0]].usage + "`")
                    .setFooter("To learn more about a specific command, run " + botConfig.prefix + "help <command>.");
            } else {
                responce = "Unknown command. Run " + botConfig.prefix + "help to see all available commands.";
            }
        }
        message.channel.send(responce);*/
    }
}