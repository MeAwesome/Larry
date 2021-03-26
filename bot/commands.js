const Discord = require("discord.js");
const botConfig = require("./config/config.json");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const ReCaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const GoogleImageScraper = require('images-scraper');

var discordAccountAuthenticated = false;

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
puppeteer.use(ReCaptchaPlugin());

const Commands = {
    help:{
        run:help,
        description:"Provides you with the commands list.",
        usage:"help [command]"
    },
    image: {
        run: googleimagesearch,
        description: "Give you an image based on your search terms.",
        usage: "image <search>"
    },
    youtube: {
        run: youtube,
        description: "Plays a youtube video in a voice channel.",
        usage: "youtube <search|link>"
    }
}

function help(message, command, args){
    var responce = new Discord.MessageEmbed().setColor("#000000");
    if(args.length == 0){
        responce.setTitle("Command List")
        .setAuthor("Help With Larry", "./images/larry.png")
        .setDescription("View all of the available commands from Larry.")
        .setThumbnail("./images/larry.png")
        .addField(":video_game: Gaming", "'minecraft'")
        .addField(":wrench: Utility", "`help`, `image`, `website`")
        .addField(":gear: Settings", "`prefix`")
        .setFooter("To learn more about a specific command, run " + botConfig.prefix + "help <command>.");
    } else {
        if(Commands.hasOwnProperty(args[0])){
            responce.setTitle(args[0].charAt(0).toUpperCase() + args[0].slice(1))
            .setAuthor("Help With Larry", "./images/larry.png")
            .setDescription(Commands[args[0]].description)
            .setThumbnail("./images/larry.png")
            .addField("Usage", "`" + Commands[args[0]].usage + "`")
            .setFooter("To learn more about a specific command, run " + botConfig.prefix + "help <command>.");
        } else {
            responce = "Unknown command. Run " + botConfig.prefix + "help to see all available commands.";
        }
    }
    message.channel.send(responce);
}

function googleimagesearch(message, command, args){
    if(args.length == 0){
        message.channel.send("You didn't give me any search terms.\n\n" + Commands[command].usage);
        return;
    }
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
        const results = await google.scrape(args.join(" "), 25);
        var src = results[Math.floor(Math.random() * results.length)].url;
        var responce = new Discord.MessageEmbed().setColor("#00FF00").setImage(src);
        message.channel.send(responce);
    })();
    message.channel.stopTyping();
}

async function youtube(message, command, args){
    if (args.length == 0) {
        message.channel.send("You didn't give me any search terms.\n\n" + Commands[command].usage);
        return;
    }
    if (message.member.voice.channel) {
        message.channel.send("connected to channel " + message.member.voice.channel);
    } else {
        message.channel.send("not connected to channel");
        return;
    }
    var response = new Discord.MessageEmbed().setColor("#FFFF00")
        .setAuthor("Please Wait")
        .setTitle("Loading Discord")
        .setDescription("Opening Browser")
        .addField("Progress", "0/10")
        .setFooter("This feature is still under development");
    var responseMessage = message.channel.send(response);
    const mainBrowser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });
    response = responseMessage.embeds[0];
    response.setDescription("Making New Web Page");
    response.spliceFields(0, 1, {
        name:"Progress",
        value:"1/10"
    });
    responseMessage.edit(response);
    var discordPage = await mainBrowser.newPage();
    message.channel.send("setting page up");
    await discordPage.setViewport({ width: 1920, height: 1080 });
    await discordPage.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
    message.channel.send("opening discord");
    await discordPage.goto("https://discord.com/channels/606964916083097633/606964916083097641");
    await discordPage.bringToFront();
    message.channel.send("logging in");
    await discordPage.type("[name=email]", "discordterrybot@programmer.net");
    await discordPage.type("[name=password]", "D1scord!Bot");
    await discordPage.click("[type=submit]");
    message.channel.send("solving reCaptcha");
    await discordPage.solveRecaptchas();
    if(!discordAccountAuthenticated){
        message.channel.send("**DETECTED**: First run since boot - authenicating discord account");
        message.channel.send("launching browser");
        const gmailBrowser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });
        message.channel.send("making new web page");
        var gmailPage = await gmailBrowser.newPage();
        message.channel.send("setting page up");
        await gmailPage.setViewport({ width: 1920, height: 1080 });
        await gmailPage.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
        message.channel.send("opening mail");
        await gmailPage.goto("https://www.mail.com/consentpage", { waitUntil: 'networkidle0' });
        await gmailPage.bringToFront();
        message.channel.send("accepting privacy statement");
        await gmailPage.waitForSelector("iframe");
        var largeFrame = await gmailPage.$("iframe");
        var largeFrameContent = await largeFrame.contentFrame();
        var smallFrame = await largeFrameContent.$("iframe");
        var smallFrameContent = await smallFrame.contentFrame();
        await smallFrameContent.waitForSelector("#onetrust-accept-btn-handler");
        await smallFrameContent.click("#onetrust-accept-btn-handler");
        message.channel.send("logging in");
        await gmailPage.waitForSelector("#login-button");
        await gmailPage.click("#login-button");
        await gmailPage.waitForSelector("#login-email");
        await gmailPage.type("#login-email", "discordterrybot@programmer.net");
        await gmailPage.type("#login-password", "D1scord!Bot");
        await gmailPage.click(".login-submit");
        message.channel.send("opening menu");
        await gmailPage.waitForNavigation();
        message.channel.send("opening inbox");
        await gmailPage.waitForSelector("[data-item-name=mail]");
        await gmailPage.click("[data-item-name=mail]");
        message.channel.send("opening most recent email");
        await gmailPage.waitForSelector("atl-app-iframe > iframe[name=mail]");
        largeFrame = await gmailPage.$("atl-app-iframe > iframe[name=mail]");
        largeFrameContent = await largeFrame.contentFrame();
        await largeFrameContent.waitForSelector("tr");
        await largeFrameContent.click("tr");
        message.channel.send("clicking discord authentication link");
        await largeFrameContent.waitForSelector("iframe[name=mail-display-content]");
        smallFrame = await largeFrameContent.$("iframe[name=mail-display-content]");
        smallFrameContent = await smallFrame.contentFrame();
        await smallFrameContent.waitForSelector("a");
        var aTags = await smallFrameContent.$$("a");
        var aTagNames = await smallFrameContent.$$eval("a", aTagList => aTagList.map(aTag => aTag.textContent));
        for(var a = 0; a < aTags.length ; a++) {
            if (aTagNames[a] != undefined && aTagNames[a].trim() == "Verify Login") {
                await aTags[a].click();
                a = aTags.length;
            }
        }
        await timeout(10000);
        message.channel.send("closing mail browser");
        await gmailBrowser.close();
        message.channel.send("resubmitting login to discord");
        await discordPage.bringToFront();
        await discordPage.click("[type=submit]");
        discordAccountAuthenticated = true;
    }
    message.channel.send("awaiting discord load");
    await timeout(5000);
    await discordPage.screenshot({ path: 'screenshot.png' });
    message.channel.send("screenshot", { files: ["./screenshot.png"] });
    await discordPage.waitForSelector('a[data-list-item-id=channels___' + message.member.voice.channel + ']');
    message.channel.send("connecting to voice channel");
    await timeout(5000);
    await discordPage.click('a[data-list-item-id=channels___' + message.member.voice.channel + ']');
    /*await timeout(3000);
    message.channel.send("making new web page");
    var youtubePage = await mainBrowser.newPage();
    message.channel.send("setting page up");
    await youtubePage.setViewport({ width: 1920, height: 1080 });
    await youtubePage.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
    message.channel.send("opening youtube");
    await youtubePage.goto("https://www.youtube.com/");
    //await youtubePage.bringToFront();
    await discordPage.bringToFront();
    await discordPage.waitForSelector(".wrapper-24pKcD");
    await discordPage.waitForSelector(".container-1giJp5");
    await discordPage.waitForSelector(".actionButtons-14eAc_");
    await discordPage.waitForSelector('button[aria-label="Share Your Screen"]');
    await discordPage.click('button[aria-label="Share Your Screen"]');*/
    await timeout(5000);
    await discordPage.screenshot({ path: 'screenshot.png' });
    message.channel.send("screenshot", { files: ["./screenshot.png"] });
    //await browser.close();
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = Commands;