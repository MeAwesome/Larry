const { prefix } = require('../../config.json');

const Discord = require("discord.js");

const GoogleImageScraper = require('images-scraper');

module.exports = {
    name: "image",
    description: "Gives you an image based on your search terms.",
    aliases: ["img", "photo"],
    usage: "[search]",
    args: true,
    cooldown: 5,
    async execute(message, args) {
        await message.delete();
        var response = new Discord.MessageEmbed()
            .setColor("#FFFF00")
            .setTitle(args.join(" "))
            .setAuthor("Requested By: " + message.author.username)
            .setFooter("Searching for your image...");
        var sendingResponse = await message.channel.send(response);
        const google = new GoogleImageScraper({
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            }
        });
        const results = await google.scrape(args.join(" "), 30);
        var src = results[Math.floor(Math.random() * results.length)].url;
        response = new Discord.MessageEmbed()
            .setColor("#00FF00")
            .setTitle(args.join(" "))
            .setAuthor("Requested By: " + message.author.username)
            .setImage(src)
            .setFooter("Press ❌ to delete this image.");
        var sentResponse = await sendingResponse.edit(response);
        await sentResponse.react('❌');
        const filter = (reaction, user) => {
            return ['❌'].includes(reaction.emoji.name) && user.id == message.author.id;
        };
        var collected = await sentResponse.awaitReactions(filter, { max: 1 });
        const reaction = collected.first();
        if (reaction.emoji.name == '❌') {
            await sentResponse.delete();
            var reply = await message.reply('successfully deleted that image you requested.');
            reply.delete({ timeout: 3000 });
        }
    }
}