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
    var url = 'https://api.reddit.com/r/%subreddit%/%category%.json?sort=top&t=%time%&limit=1';
    var subreddit_arr=['whatcouldgowrong', 'hadtohurt', 'holdmybeer', 'nononono', 'instant_regret', 'idiotsfightingthings'];
    var time_arr= ['day', 'week', 'month', 'year', 'all'];
    var category_arr = ['top', 'random'];

    var subreddit='';
    var time=time_arr[0]; //for the time being default to day
    var category = category_arr[0]; //default to top

    //get the message when there is a time included: !hadtohurt month
    if (message.indexOf(' ') > -1)
    {
        var message_arr = message.split(' ');
        message = message_arr[0]; //get the subreddit

        //get the time
        if (time_arr.indexOf(message_arr[1]) > -1)
        {
            time = message_arr[1];
        }
    }

    //listen for message to execute command
    //message will need to start with !fail
    if (message == '!random') {
        subreddit=subreddit_arr[Math.floor(Math.random() * subreddit_arr.length-1)];
        category=category_arr[/*1*/0];
    }
    else if (message.substring(0, 1)=='!' && subreddit_arr.indexOf(message.slice(1)) != -1)
    {
        subreddit = subreddit_arr[subreddit_arr.indexOf(message.slice(1))];
    }

    if (subreddit !='')
    {
        url = url.replace('%subreddit%', subreddit).replace('%time%', time).replace('%category%', category);
        console.log(url);
        const options={
            url: url,
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