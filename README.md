# keyboardr
I recently got a [SteelSeries APEX M750](https://steelseries.com/gaming-keyboards/apex-m750-tkl) keyboard. Besides being delightfully clackety, it has each-key-addressable LEDs.
The SteelSeries Engine includes a built-in webserver to which you can HTTP-POST events and trigger custom code-defined routines
for illuminating specific keys, managing flash rates, etc.

I decided to integrate this with Slack. In this experiment, when my user is "@" mentioned in a specific Slack workspace, it will
trigger an event and do the following:

* Illuminate the number row, "q" row, "a" row and "z" row with one of the 4 main Slack icon colors
* Cycle these 4 colors in a circle of pairs on the keypad
* Flash the keypad "5" intermittently...it's the "S" of the Slack logo, get it? :)

Here's what it looks like:

https://github.com/existdissolve/keyboardr/blob/master/video.mp4

I started by using the pure [JSON-handler](https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-json.md) approach, but found it to very limited. You can achieve similar results, but it's quite slow and you don't have fine-grained control over the order/timing in which keys are illuminated.

So I moved to using the [GoLisp handlers](https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/writing-handlers-in-golisp.md). Wow. GoLisp is just terrible. Imagine the worst parenthesis hell, and then double it. And then set it on fire.

I finally hacked together something that works, but it feels gross. The docs are pretty sparse, so it's hard to really find answers to how to do things better, so :shrug:

Anyway, if you want to try this out yourself, clone this repo and then do the following:

## Install SteelSeries Engine 3
Obviously, this all assumes you have a relevant keyboard from SteelSeries :) Go ahead and install Steel Series Engine 3 from here: https://steelseries.com/engine

## `config.js`
Add a `config.js` to the root of this project. In here, export an object that looks like so:

```
export default {
    user: 'some_user_name',
    workspace: 'some_workspace',
    token: 'some_legacy_token'
}
```

The "token" can be generated here:

https://api.slack.com/custom-integrations/legacy-tokens

## `slacker.lsp Symbolic Link`
Add a symbolic link for the `slacker.lsp` file to the `hax0rBindings` folder in the SteelSeries Engine 3 installation. For example:

```
ln -s ~/keyboardr/slackr.lsp "/Library/Application Support/SteelSeries Engine 3/hax0rBindings"
```

Adjust as needed for your environment

## Run This App!
Start up this app via `npm start`. Now @mention yourself (or have someone else do it!) in Slack. You should now see the pretty!
