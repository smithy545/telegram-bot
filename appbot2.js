var fs = require('fs');
var TelegramBot = require("node-telegram-bot-api");

var token = "212904367:AAH9BIRY_vE4LTegCO3fLPFYxc2WFVTgkxg";
// Setup polling way
var bot = new TelegramBot(token, {polling: {timeout:10, interval:100}});
var commands = /(\/help)|(\/reset)|(\/end)|(\/start)/;

var db = JSON.parse(fs.readFileSync('./storage.txt'));

var unanswered = ["How are you?", "What's up", "Where are you from?", "What's your name?", "What do you like to do?"];
var asking = {};

// Matches /help
bot.onText(/\/help/, function(msg, match) {
	var helpList = "Talk to me brah";
	bot.sendMessage(msg.chat.id, helpList);
});

// Matches /reset
bot.onText(/\/reset/, function(msg, match) {
	//db = {'hi':{total:1, answers:{'hi':1}}};
	unanswered = ["whats up", "thats cool", "whats your name"];
	bot.sendMessage(msg.chat.id, "Bot memory reset to basic.");
});

// Matches /end
bot.onText(/\/end/, function(msg, match) {
	asking[msg.chat.id] = undefined;
	bot.sendMessage(msg.chat.id, "Conversation ended.");
});

// Any kind of message
bot.on('message', function (msg) {
	if(commands.test(msg.text)) {
		return console.log(msg.text);
	}

	var q = clean(msg.text);
	var qdirty = msg.text;
	var resp;

	if(asking[msg.chat.id] != undefined) {
		if(db[asking[msg.chat.id]] != undefined) {
			if(db[asking[msg.chat.id]].answers[qdirty]) {
				db[asking[msg.chat.id]].answers[qdirty]++;
			} else {
				db[asking[msg.chat.id]].answers[qdirty] = 1;
			}
			db[asking[msg.chat.id]].total++;
		} else {
			db[asking[msg.chat.id]] = {
				answers: {},
				total: 1
			};
			db[asking[msg.chat.id]].answers[qdirty] = 1;
		}
	}
	if(db[q] != undefined) {
		resp = pickFrom(db[q]);
		asking[msg.chat.id] = clean(resp);
		unanswered.push(resp);
	} else{
		resp = unanswered.splice(Math.floor(Math.random()*unanswered.length), 1)[0];
		asking[msg.chat.id] = clean(resp);
		unanswered.push(qdirty);
	}

	console.log(unanswered);

	bot.sendMessage(msg.chat.id, resp);
});


function clean(word) {
	return word.toLowerCase().replace(/[^a-zA-Z0-9 ]/,'');
}

function pickFrom(question) {
	var freq = {};
	for(i in question.answers) {
		freq[i] = question.answers[i]*1.0/question.total;
	}
	var total = 0;
	var r = Math.random();
	for(i in freq) {
		total += freq[i];
		if(r <= total) {
			return i;
		}
	}

	return -1;
}

setInterval(function() {
	fs.writeFile('./storage.txt', JSON.stringify(db));
}, 10000);