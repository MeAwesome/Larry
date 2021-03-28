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
    execute(message, args) {
        message.channel.startTyping();
        const google = new GoogleImageScraper({
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            }
        });
        (async () => {
            const results = await google.scrape(args.join(" "), 30);
            var src = results[Math.floor(Math.random() * results.length)].url;
            var response = new Discord.MessageEmbed()
                .setColor("#00FF00")
                .setTitle(args.join(" "))
                .setAuthor("Requested By: " + message.author.username)
                .setImage(src)
                .setFooter("Press the ❌ to delete this image if I didn't find what you were looking for.\nYou will be unable to delete using the ❌ after 1 minute.");
            
            message.channel.send(response).then(sentResponse => {
                sentResponse.react('❌').then(() => {
                    //sentResponse.react('👎')
                });

                const filter = (reaction, user) => {
                    return ['❌'].includes(reaction.emoji.name) && user.id == message.author.id;
                };

                sentResponse.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name == '❌') {
                            message.delete().then(() => {
                                sentResponse.delete().then(() => {
                                    message.reply('successfully deleted that image you requested.').then((reply) => {
                                        reply.delete({ timeout: 3000 });
                                    });
                                }).catch(() => {
                                    message.reply('there was an issue deleting the image you requested.');
                                });
                            }).catch(() => {
                                message.reply('there was an issue deleting the image you requested.');
                            });
                        }
                    })
                    .catch(collected => {
                        
                    });

                message.channel.stopTyping();
            });
        })();
    }
}