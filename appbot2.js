var fs = require('fs');
var TelegramBot = require("node-telegram-bot-api");

var token = "217736145:AAGHjRNRwjIfEYxesCsU_NuhJo01EJTebAo";
// Setup polling way
var bot = new TelegramBot(token, {polling: {timeout:10, interval:100}});
var commands = /(\/help)/;

var contents = fs.readFileSync('./pg1342.txt', 'utf-8');

var db = {'hi':{total:1, answers:{'hi':1}}};
var unanswered = ["whats up"];
var asking = {};

// Any kind of message
bot.on('message', function (msg) {
	if(commands.test(msg.text)) {
		return console.log(msg.text);
	}

	var q = clean(msg.text);
	var resp;

	if(asking[msg.chat.id] != undefined) {
		if(db[asking[msg.chat.id]] != undefined) {
			if(db[asking[msg.chat.id]].answers[q]) {
				db[asking[msg.chat.id]].answers[q]++;
			} else {
				db[asking[msg.chat.id]].answers[q] = 1;
			}
			db[asking[msg.chat.id]].total++;
		} else {
			db[asking[msg.chat.id]] = {
				answers: {},
				total: 1
			};
			db[asking[msg.chat.id]].answers[q] = 1;
		}
	}
	if(db[q] != undefined) {
		resp = pickFrom(db[q]);
		asking[msg.chat.id] = resp;
		unanswered.push(resp);
	} else{
		resp = unanswered.pop();
		asking[msg.chat.id] = resp;
		unanswered.push(q);
	}

	console.log(db);
	console.log(unanswered);

	bot.sendMessage(msg.chat.id, resp);
});


function clean(word) {
	return word.toLowerCase();
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