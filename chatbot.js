var fs = require('fs');
var TelegramBot = require("node-telegram-bot-api");

var token = "212904367:AAH9BIRY_vE4LTegCO3fLPFYxc2WFVTgkxg";
// Setup polling way
var bot = new TelegramBot(token, {polling: {timeout:10, interval:100}});
var commands = /(\/help)|(\/reset)|(\/end)|(\/start)|(\/skip)|(\/seed)/;

var db = JSON.parse(fs.readFileSync('./storage.txt'));

var unanswered = ["How are you?", "What's up", "Where are you from?", "What's your name?", "What do you like to do?", "Who has been the biggest influence in your life?", "What kinds of things really make you laugh?", "What's your favorite place in the entire world?", "What's your favorite movie of all time?"];
var asking = {};

absorbFile('./clean_texts.txt', db);

/*
// Matches /help
bot.onText(/\/help/, function(msg, match) {
	var helpList = "Talk to me brah";
	bot.sendMessage(msg.chat.id, helpList);
});

// Matches /reset
bot.onText(/\/reset/, function(msg, match) {
	//db = {'hi':{total:1, answers:{'hi':1}}};
	unanswered = ["How are you?", "What's up", "Where are you from?", "What's your name?", "What do you like to do?", "Who has been the biggest influence in your life?", "What kinds of things really make you laugh?", "What's your favorite place in the entire world?", "What's your favorite movie of all time?"];
	bot.sendMessage(msg.chat.id, "Bot memory reset to basic.");
});
*/
// Matches /end
bot.onText(/\/end/, function(msg, match) {
	asking[msg.chat.id] = undefined;
	bot.sendMessage(msg.chat.id, "Conversation ended.");
});

// Matches /skip
bot.onText(/\/skip/, function(msg, match) {
	unanswered.push(asking[msg.chat.id]);
	var resp = unanswered.splice(Math.floor(Math.random()*unanswered.length), 1)[0];
	asking[msg.chat.id] = clean(resp);
	bot.sendMessage(msg.chat.id, resp);
});

/*
// Matches /seed
bot.onText(/\/seed/, function(msg, match) {
	bot.sendMessage(msg.chat.id, "not set");
});
*/
// Any kind of message
bot.on('message', function (msg) {
	if(commands.test(msg.text)) {
		return 'command';
	}

	bot.sendChatAction(msg.chat.id, "typing");

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
		unanswered.push(qdirty);
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

function absorbFile(filename, db) {
	var info = fs.readFileSync(filename, {encoding:'utf-8'}).replace(/\r/, '').split('\n');
	for(var i = 0; i < info.length - 1; i++) {
		if(info[i] != '') {
			var line = clean(info[i]);
			var next = info[i+1];
			if(db[line] != undefined) {
				db[line].total++;
				if(db[line].answers[next] != undefined) {
					db[line].answers[next]++;
				} else {
					db[line].answers[next] = 1;
				}
			} else {
				db[line] = {
					answers: {},
					total: 1
				};
				db[line].answers[next] = 1;
			}
		}
	}

	return db;
}

setInterval(function() {
	fs.writeFile('./storage.txt', JSON.stringify(db));
}, 10000);
