'use strict';

const co = require('co');
const Botkit = require('botkit');
const getURLs = require('get-urls');
const CONSTANTS = require('./constants');
const LeanCloud = require('./libs/leancloud');

const controller = Botkit.slackbot({
    debug: true,
    clientId: process.env.sl_client_id,
    clientSecret: process.env.sl_secret,
    scopes: ['bot'],
    json_file_store: './storage'
});
const bot = controller.spawn({token: process.env.sl_token});

bot.startRTM(function(err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to Slack');
        bot.closeRTM();
    }
  
    // close the RTM
    let rtmTimeout = setTimeout(function() {
        bot.closeRTM();
    }, CONSTANTS.RTM_TIMEOUT);
});

/* 在channel中, 非@的情况下, 会触发ambient方法 */
controller.on('ambient',function(bot, message) {
    const text = message.text || '';
    if(!text) return false;

    const urls = getURLs(text);
    const replyData = {
        username: 'Housekeeper@ambient' ,
        text: urls.size ? `You post some links "${[...urls].join(', ')}" here??` : `You said "${text}".`,
        // attachments: [{
        //     "fallback": "Required plain-text summary of the attachment.",
        //     "color": "#36a64f",
        //     "pretext": "Optional text that appears above the attachment block",
        //     "author_name": "@Mr Pang.Xie",
        //     "author_link": "http://flickr.com/bobby/",
        //     "author_icon": "https://tva2.sinaimg.cn/crop.0.1.431.431.180/6d6970b9jw8etvcf7oytyj20bz0caq46.jpg",
        //     "title": "Slack API Documentation",
        //     "title_link": "https://api.slack.com/",
        //     "text": "Optional text that appears within the attachment",
        //     "fields": [{
        //         "title": "Priority",
        //         "value": "High",
        //         "short": false
        //     }],
        //     "image_url": "https://ae01.alicdn.com/kf/HTB18vXEgcjI8KJjSspp760byVXaS.png",
        //     "thumb_url": "https://tva2.sinaimg.cn/crop.0.1.431.431.180/6d6970b9jw8etvcf7oytyj20bz0caq46.jpg",
        //     "footer": "Slack API",
        //     "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
        //     "ts": Date.now()
        // }]
    }

    // co(function *() {
    //     const ret = yield LeanCloud();
    //     console.log('ret:', ret);
    // });
    
    bot.reply(message, replyData);
})
    
/* 在Channel中, 被直接@的时候, 触发direct_mention方法 */
controller.on('direct_mention',function(bot, message) {
    bot.reply(message, {
        text: 'I heard you mention me!',
        username: "Housekeeper@mention"
    });
});
