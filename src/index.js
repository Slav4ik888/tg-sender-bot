import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { broadcast, parseUsernames } from './utils/index.js';




console.log('env: ', process.env.NODE_ENV);
const SUBSCRIBERS = parseUsernames(process.env.SUBSCRIBERS);
console.log('SUBSCRIBERS: ', SUBSCRIBERS);
const ADMIN_ID = Number(process.env.ADMIN_ID);
const MESSAGE = 'Hello, it is a message from Rhythm!';


const bot = new Telegraf(process.env.TELEGRAMM_BOT_TOKEN);


bot.command('start', async (ctx) => {
  await ctx.reply('Pressed start');
});

bot.command('send_all', async (ctx) => {
  try {
    if (ctx.from.id !== ADMIN_ID) return ctx.reply('❌ Эта команда доступна только админу');;

    if (!MESSAGE) return ctx.reply('❌ Укажите сообщение для рассылки');

    await ctx.reply('Start broadcast...');

    const result = await broadcast(bot, SUBSCRIBERS, MESSAGE);
    console.log('result: ', result);

    await ctx.reply('Ended broadcast', result);
  }
  catch (e) {
    console.log('Error send_all: ', e.message);
    await ctx.reply(e.message);
  }
});


bot.on(message('text'), async (ctx) => {
  try {
    await ctx.reply(code('Cообщение принял, обрабатываю...'))
    // await ctx.reply(JSON.stringify(ctx.update.message, null, 2));

    await ctx.reply('Типо обработал.');
  }
  catch (e) {
    console.log('Error in audio message: ', e.message);
    await ctx.reply(e.message);
  }
});


// Обработка ошибок
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
});

// Запуск бота
bot.launch().then(() => {
  console.log('Sender bot started!');
});

// =================================================

console.log(`Starting tg-sender-bot...`);

process.once('SIGINT', () => {
  console.log('[SIGINT] stop bot!');
  bot.stop('SIGINT');
}); // If nodejs stopped => we will stop bot

process.once('SIGTERM', () => {
  console.log('[SIGTERM] stop bot!');
  bot.stop('SIGTERM');
});


// t.me/Rhythm_panel_bot
// git add . && git commit -m "2025-10-23" && git push -u origin main
