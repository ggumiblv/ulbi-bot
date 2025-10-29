//import TelegramApi from 'node-telegram-bot-api';
const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '8288459743:AAHbu7oB5UyXyuPnVn1UseARqvV3RRu51EE';

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Начальное приветствие' },
  { command: '/info', description: 'Описание' },
  { command: '/game', description: 'Игра угадай цифру' }
]);

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
};

const start = () => {
  bot.on('message', async (msq) => {
    const text = msq.text;
    const chatId = msq.chat.id;
    //bot.sendMessage(chatId, `Ты написал мне ${text}`);

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.webp'
      );
      return bot.sendMessage(chatId, 'Приветик!');
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msq.from.first_name}`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Ниче не понял');
  });

  bot.on('callback_query', async (msq) => {
    const data = msq.data;
    const chatId = msq.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
