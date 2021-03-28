const { prefix } = require('../config.json');

const Discord = require("discord.js");
const ytdl = require('ytdl-core');

const queue = [];

module.exports = {
    name: "music",
    description: "Plays a song in your voice channel.",
    aliases: ["play", "song", "audio"],
    usage: "[search|link]",
    args: true,
    cooldown: 3,
    async execute(message, args) {
        message.channel.startTyping();
        if (!message.member.voice.channel) {
            message.reply('join a voice channel to use this command.').then((reply) => {
                message.delete({ timeout: 3000 }).then(() => {
                    reply.delete();
                })
            });
            message.channel.stopTyping();
            return;
        }
        const songInfo = await ytdl.getInfo(args.join(" "));
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };
        message.channel.stopTyping();
    }
}