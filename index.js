var gtts = require('node-gtts');
var path = require('path');
const { Telegraf } = require('telegraf')
const { Markup } = require('telegraf')
const config = require('./config.json')

BOT_TOKEN = config.BOT_TOKEN

const bot = new Telegraf(BOT_TOKEN);

function start(ctx) {
    const msgid = ctx.update.message.message_id
    const msg = `
Hi, Thank for starting me.

I'm Text-To-Speech Bot. I use google-text-speech.

<b>How To Use Me</b>⁉️
<i>I'm very easy to use!</i>

<b>Command:</b> /tts <b>your language code</b> <i>your text to speech</i>

Check out /help & /about too.

<b>Help Group:</b> <a href='https://telegram.dog/HelpSupportChat'>Help Support Chat</a>.
<b>Updates in</b> <a href='https://telegram.dog/SastaNetwork'>Sasta Network</a>.

<b>Note:</b> <i>To use me in groups, remember to make me admin, so i could read messages and interact with them.</i>

© <a href='https://telegram.dog/SastaNetwork'>Sasta Network</a> 2022-present.
    `
    ctx.replyWithHTML(msg, Markup.inlineKeyboard([
        [Markup.button.url('➕ Add me to your groups ➕', `https://telegram.dog/${ctx.botInfo.username}?startgroup=true`)],
        [Markup.button.url('🤖 Bot Source Code (GitHub) 🤖', 'https://github.com/SastaDev/Text-To-Speech-Telegram-Bot')]
                ]), {reply_to_message_id: msgid})
}

function help(ctx) {
    const msgid = ctx.update.message.message_id
    const msg = `
<b>Text-To-Speech</b>
<b>Comand:</b> /tts (language code) (your text)
<b>Usage:</b> /tts en hello everyone


<b>Almost all langauges code are supported</b>

<b>Note:</b> <i>To use me in groups, remember to make me admin, so i could read messages and interact with them.</i>

<b>Help Group:</b> <a href='https://telegram.dog/HelpSupportChat'>Help Support Chat</a>.
<b>Updates in</b> <a href='https://telegram.dog/SastaNetwork'>Sasta Network</a>.
    `
    ctx.replyWithHTML(msg, {reply_to_message_id: msgid})
}

function about(ctx) {
    const msgid = ctx.message.message_id
    const msg = `
<b>Text-To-Speech-Telegram-Bot</b>

Tranlates using google text-to-speech.

Written in <b>Node.JS</b>

Created With Love By <a href='https://telegram.dog/SastaDev'>Sasta Dev</a>.

Thanks To <a href='https://github.com/telegraf/telegraf'>Telegraf</a> & <a href='https://github.com/thiennq/node-gtts'>node-gtts</a>

Source code of this bot can be found at github.
Link to source code: https://github.com/SastaDev/Text-To-Speech-Telegram-Bot

<b>Help Group:</b> <a href='https://telegram.dog/HelpSupportChat'>Help Support Chat</a>.
<b>Updates in</b> <a href='https://telegram.dog/SastaNetwork'>Sasta Network</a>.

© <a href='https://telegram.dog/SastaDev'>Sasta Dev</a>.
<a href='https://telegram.dog/SastaNetwork'>Sasta Network</a>, 2022-present.
    `
    ctx.replyWithHTML(msg, {reply_to_message_id: msgid})
}

function added(ctx) {
    const message = ctx.update.message
    const msgid = message.message_id
    if (message.new_chat_participant) {
        const new_chat_p = message.new_chat_participant
        if (new_chat_p.id === bot.botInfo.id) {
            const msg = `
Thank You <a href='tg://user?id=${message.from.id}'>${message.from.first_name} ${message.from.last_name ? message.from.last_name : '\u200b'}</a> for adding me here!

• Promote me as admin, so i can get access to the messages!
            `
            ctx.replyWithHTML(msg, {reply_to_message_id: msgid})
        }
    }
}

function text_to_speech(ctx) {
    const msgid = ctx.message.message_id
    const splited_text_list = ctx.message.text.split(' ')
    if (splited_text_list.length <= 1) {
        ctx.replyWithHTML('Please provide a language code!')
        return
    }
    try {
        const lang = gtts(splited_text_list[1])
    } catch {
        ctx.replyWithHTML('Invalid language code or langauage code not supported yet.')
        return
    }
    if (splited_text_list.length === 2) {
        ctx.replyWithHTML('Please write some text to speech.')
        return
    }
    ctx.replyWithHTML('Generating...')
    const Text_To_Speech = splited_text_list.slice(2).join(' ')
    const filepath = path.join(__dirname, `${msgid}.wav`)
    const lang = gtts(splited_text_list[1])
    lang.save(filepath, Text_To_Speech, function () {
        ctx.replyWithVoice({source: `${msgid}.wav`}, {caption: `Created By @${ctx.botInfo.username}`})
    })
}

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.command('start', ctx => start(ctx))
bot.command('help', ctx => help(ctx))
bot.command('about', ctx => about(ctx))
bot.command('tts', ctx => text_to_speech(ctx))
bot.on('message', ctx => added(ctx))

bot.launch()

console.log('Text-To-Speech Telegram Bot Has Been Started!')