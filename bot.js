var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const request = require('request');

//conf logger
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

logger.level = 'debug';

//init bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    var url = 'https://api.reddit.com/r/';
    //listen for message to execute command
    //message will need to start with !fail
    if (message == '!fail') {
        const options={
            url: 'https://api.reddit.com/r/whatcouldgowrong/top.json?sort=top&t=day&limit=1',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent':'my-reddit-client'
            }
        };

        request(options, function(err, res, body)
        {
            let json = JSON.parse(body);
            bot.sendMessage({
                to:channelID,
                message: json.data.children[0].data.url
            });
        });
      }  
})