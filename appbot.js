var fs = require('fs');
var TelegramBot = require("node-telegram-bot-api");

var token = "217736145:AAGHjRNRwjIfEYxesCsU_NuhJo01EJTebAo";
// Setup polling way
var bot = new TelegramBot(token, {polling: {timeout:10, interval:100}});
var commands = /(\/help)|(\/later (.+) (.+))|(\/later (.+))/

var chain = {};

var contents = fs.readFileSync('./pg1342.txt', 'utf-8');
var words = contents.split(/\s+/);
var q = 0;

for(i in words) {
	i = parseInt(i);
	if(words[i].endsWith(".")) {
		console.log(cwordchain);
		q = i;
	}
	var cwords = [clean(words[i])];
	var cwordchain = clean(words[q]);
	for(var j = q; j <= i; j++) {
		cwordchain += " " + clean(words[j]);
	}
	cwords.push(cwordchain);
	for(cw in cwords) {
		var cword = cwords[cw];
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
}

// Matches /help
bot.onText(/\/help/, function(msg, match) {
	var chatId = msg.chat.id;
	var helpList = "/later [XXhYYmZZs] [message] - Send the given message after XX hours, YY minutes, and ZZ seconds.";
	bot.sendMessage(chatId, helpList);
});

// Matches /later [time] [message]
bot.onText(/\/later (.+) (.+)/, function(msg, match) {
	var time = match[1];
	var message = match[2];
	if(/([0-9]+h)|([0-9]+m)|([0-9]+s)/.test(time)) {
		var h = time.match(/[0-9]+h/);
		var m = time.match(/[0-9]+m/);
		var s = time.match(/[0-9]+s/);
		if(h != null) {
			h = Math.floor(h[0].slice(0,-1));
		} else { h = 0; }
		if(m != null) {
			m = Math.floor(m[0].slice(0,-1));
		} else { m = 0; }
		if(s != null) {
			s = Math.floor(s[0].slice(0,-1));
		} else { s = 0; }
		setTimeout(function() {
			bot.sendMessage(msg.chat.id, message);
		}, h*60*60*1000+m*60*1000+s*1000-100);
	} else {
		return bot.sendMessage(msg.chat.id, "Invalid time\nFormat: /later [XXhYYmZZs] [message]");
	}
});

// Matches /later [time]
bot.onText(/\/later (.+)/, function(msg, match) {
	var time = match[1];
	if(/([0-9]+h)|([0-9]+m)|([0-9]+s)/.test(time)) {
		var h = time.match(/[0-9]+h/);
		var m = time.match(/[0-9]+m/);
		var s = time.match(/[0-9]+s/);
		if(h != null) {
			h = Math.floor(h[0].slice(0,-1));
		} else { h = 0; }
		if(m != null) {
			m = Math.floor(m[0].slice(0,-1));
		} else { m = 0; }
		if(s != null) {
			s = Math.floor(s[0].slice(0,-1));
		} else { s = 0; }
		bot.sendMessage(msg.chat.id, "Message:")
		.then(function(sended) {
			bot.onReplyToMessage(sended.chat.id, sended.message_id, function(message) {
				setTimeout(function() {
					bot.sendMessage(sended.chat.id, message.text);
				}, h*60*60*1000+m*60*1000+s*1000-100);
			});
		});
	} else {
		return bot.sendMessage(msg.chat.id, "Invalid time\nFormat: /later [XXhYYmZZs] [message]");
	}
});


// Any kind of message
bot.on('message', function (msg) {
	if(commands.test(msg.text)) {
		return console.log(msg.text);
	}

	var outmax = 100;

	console.log(msg.text);
	var words = msg.text.split(/\s+/);

	for(i in words) {
		i = parseInt(i);
		var cwords = [clean(words[i])];
		var cwordchain = clean(words[0]);
		for(var j = 1; j <= i; j++) {
			cwordchain += " " + clean(words[j]);
		}
		cwords.push(cwordchain);
		for(cw in cwords) {
			var cword = cwords[cw];
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
	}

	var seed = clean(words[words.length-1]);
	var next = -1;
	var out = [];

	console.log(chain[seed]);	
	if(Object.keys(chain[seed].next).length > 1) {
		console.log("next checking");
		var freq = getFrequencies(chain[seed].next, chain[seed].nextCount);
		var total = 0;
		while(out.length < outmax && (next != "" || out.length == 0)) {
			var r = Math.random();
			for(i in freq) {
				total += freq[i];
				if(r < total) {
					next = i;
					total = 0;
					break;
				}
			}
			out.push(next);
		}
	}

	if (Object.keys(chain[seed].next).length > 1) {
		console.log("previous checking");
		var freq = getFrequencies(chain[seed].prev, chain[seed].prevCount);
		var total = 0;
		next = -1;
		while(out.length < outmax && (next != "" || out.length == 0)) {
			var r = Math.random();
			for(i in freq) {
				total += freq[i];
				if(r < total) {
					next = i;
					total = 0;
					break;
				}
			}
			out.unshift(next);
		}
	}

	if (Object.keys(chain[seed].next).length <= 1 && Object.keys(chain[seed].next).length <= 1){
		console.log("random checking");
		var counts = {};
		var total = 0;
		for(i in chain) {
			counts[i] = chain[i].count;
			total += counts[i];
		}

		var freq = getFrequencies(counts, total);
		total = 0;
		var r = Math.random();
		for(i in freq) {
			total += freq[i];
			if(r < total) {
				next = i;
				break;
			}
		}

		chain[seed].next[next] = 1;
		chain[seed].nextCount++;
		chain[next].prevCount++;
		if(chain[next].prev[seed] != undefined) {
			chain[next].prev[seed]++;
		} else {
			chain[next].prev[seed] = 1;
		}

		out.push(next);
	}

	bot.sendMessage(msg.chat.id, out.join(" "));
});


// Any kind of inline query
bot.on('inline_query', function(msg) {
	console.log(msg);
});

function getFrequencies(list, total) {
	var freq = {};
	for(i in list) {
		freq[i] = list[i]*1.0/total;
	}
	return freq;
}

function clean(word) {
	return word.toLowerCase().replace(/\W/g, '');
}