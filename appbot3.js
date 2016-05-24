'use strict'

var token = "217736145:AAGHjRNRwjIfEYxesCsU_NuhJo01EJTebAo";

var tg = require('telegram-node-bot')(token)

tg.router.
    when(['ping'], 'PingController').
    otherwise('OtherwiseController')

tg.controller('PingController', ($) => {
    tg.for('ping', () => {
        $.sendMessage('pong')
    })
})

tg.controller('OtherwiseController', ($) => {
	$.sendMessage($.message.text);
});

tg.inlineMode(($) => {
	console.log($);
	results = [{
	}];
	$.answer([{text: 'test'}]);
});

function quotify(s) {
	return '"' + s + '"';
}

function postscript(s) {
	ps = " ";
	return s + ps;
}

function emojify(s) {
	s.split(/\s+/);
	return s;
}

function italicize(s) {
	return s;
}