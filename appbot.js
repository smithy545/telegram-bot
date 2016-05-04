var fs = require('fs');
var TelegramBot = require("node-telegram-bot-api");

var token = "217736145:AAGHjRNRwjIfEYxesCsU_NuhJo01EJTebAo";
// Setup polling way
var bot = new TelegramBot(token, {polling: {timeout:10, interval:100}});
var commands = /(\/help)/;

var contents = fs.readFileSync('./pg1342.txt', 'utf-8');
var words = contents.split(/\s+/);
var order = 2;

var chain = chainInput(words, {});

// Matches /help
bot.onText(/\/help/, function(msg, match) {
	var chatId = msg.chat.id;
	var helpList = "Talk to me brah";
	bot.sendMessage(chatId, helpList);
});

// Any kind of message
bot.on('message', function (msg) {
	if(commands.test(msg.text)) {
		return console.log(msg.text);
	}

	console.log(msg.text);
	var words = msg.text.split(/\s+/);

	chain = chainInput(words);

	bot.sendMessage(msg.chat.id, readChain(words[words.length-1], chain));
});

function getFrequencies(list, total) {
	var freq = {};
	for(i in list) {
		freq[i] = list[i]*1.0/total;
	}
	return freq;
}

function chooseRandom(frequencies) {
	var total = 0;
	var r = Math.random();
	for(i in freq) {
		total += freq[i];
		if(r < total) {
			return i;
		}
	}
}

function clean(word) {
	return word.toLowerCase().replace(/\W/g, '');
}

function chainInput(words, chain) {
	for(var i = 0; i < words.length; i++) {
		var cword = clean(words[i]);

		if(chain[cword] != undefined) {
			chain[cword].count++;
		} else {
			chain[cword] = {
				count: 1,
				next: { "" : 1 },
				prev: { "" : 1 },
				nextCount: 1,
				prevCount: 1
			};
		}
		if(i > 0) {
			chain[cword].prevCount++;
			if(chain[cword].prev[clean(words[i-1])] != undefined) {
				chain[cword].prev[clean(words[i-1])]++;
			} else {
				chain[cword].prev[clean(words[i-1])] = 1;
			}
		}
		if(i < words.length - 1) {
			chain[cword].nextCount++;
			if(chain[cword].next[clean(words[i+1])] != undefined) {
				chain[cword].next[clean(words[i+1])]++;
			} else {
				chain[cword].next[clean(words[i+1])] = 1;
			}
		}
	}
	return chain;
}

function readChain(seed, chain) {
	var cur = -1;
	var out = [];
	var outmax = 2*(seed.length + 1);

	if(Object.keys(chain[seed].next).length > 1) {
		var freq = getFrequencies(chain[seed].next, chain[seed].nextCount);
		var total = 0;
		while(out.length < outmax && (cur != "" || out.length == 0)) {
			var r = Math.random();
			for(i in freq) {
				total += freq[i];
				if(r < total) {
					cur = i;
					total = 0;
					break;
				}
			}
			out.push(cur);
		}
	}

	if (Object.keys(chain[seed].next).length > 1) {
		var freq = getFrequencies(chain[seed].prev, chain[seed].prevCount);
		var total = 0;
		cur = -1;
		while(out.length < outmax && (cur != "" || out.length == 0)) {
			var r = Math.random();
			for(i in freq) {
				total += freq[i];
				if(r < total) {
					cur = i;
					total = 0;
					break;
				}
			}
			out.unshift(cur);
		}
	}

	if (Object.keys(chain[seed].next).length <= 1 && Object.keys(chain[seed].next).length <= 1){
		var counts = {};
		var total = 0;
		for(i in chain) {
			counts[i] = chain[i].count;
			total += counts[i];
		}

		out.push(cur);
	}
}