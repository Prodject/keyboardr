import RTM from 'slackbotapi';
import Slack from 'slack-node';
import axios from 'axios';
import data from '/Library/Application Support/SteelSeries Engine 3/coreProps.json';

import config from './config.js';

let userId;

const {user, token, workspace} = config;
const {address} = data;
const game = 'SLACKR';
const headers = {'Content-Type': 'application/json'};
const eventUrl = `http://${address}`;

const slack = new Slack(token);
const rtm = new RTM({
    token,
    logging: false,
    autoReconnect: true
});

// first things first; figure out who I am
slack.api('auth.test', (err, res) => {
    userId = res['user_id'];
});

const sendEvent = async keys => {
    return new Promise(resolve => {
        setTimeout(async () => {
            await axios.post(`${eventUrl}/game_event`, {
                game,
                event: 'SLACKD',
                data: {value: keys}
            }, {headers});

            resolve();
        }, 0);
    });
};

const sendInitialize = event => {
    axios.post(`${eventUrl}/game_event`, {
        game,
        event,
        data: {value: true}
    }, {headers});
};

// listen for messages
rtm.on('message', async data => {
    // only proceed if a user message is set up
    if (userId) {
        const rootExp = `<@${userId}>`;
        const re = new RegExp(rootExp, 'g');
        // only act if a message @'s me
        if (re.test(data.text)) {
            let keys = [97, 96, 95, 92, 89, 90, 91, 94];
            // initialize with start
            sendInitialize('START');
            // send a bunch of events to animate the keys
            for (let x = 0; x < 64; x++) {
                const oldKey = keys.shift();
                keys.push(oldKey);

                await sendEvent(keys.slice());
            }
            // we're done, so trigger stop so keys don't stay illuminated for 15 seconds after events are done
            sendInitialize('STOP');
        }
    }
});
