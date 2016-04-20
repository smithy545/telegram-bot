var TelegramBot = require('node-telegram-bot-api');

var token = '217736145:AAGHjRNRwjIfEYxesCsU_NuhJo01EJTebAo';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
var commands = /(\/echo (.+))|(\/help)|(\/test)/

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
	var fromId = msg.from.id;
	var resp = match[1];
	bot.sendMessage(fromId, resp);
});

// Matches /help
bot.onText(/\/help/, function(msg, match) {
	var fromId = msg.from.id;
	var helpList = "/echo [whatever] - echooooo";
	bot.sendMessage(fromId, helpList);
});

// Matches /test
bot.onText(/\/test/, function(msg, match) {
	var fromId = msg.from.id;
	bot.sendLocation(fromId, 42.35, -71.1984);
});

// Matches /love
bot.onText(/\/love/, function (msg) {
  var chatId = msg.chat.id;
  var opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [
          ['Yes, you are the bot of my life ❤'],
          ['No, sorry there is another one...']]
      })
    };
    bot.sendMessage(chatId, 'Do you love me?', opts);
});

// Any kind of message
bot.on('message', function (msg) {
	if(commands.test(msg.text)) {
		return console.log(msg.text);
	}
	bot.sendMessage(msg.from.id, 'Command "'+msg.text+'" not found. Type /help for more options.');
});