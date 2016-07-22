'use strict'

var token = "217736145:AAGHjRNRwjIfEYxesCsU_NuhJo01EJTebAo";
var tg = require('telegram-node-bot')(token)

tg.router.
    otherwise('OtherwiseController')

tg.controller('OtherwiseController', ($) => {
	$.sendMessage($.message.text);
});

tg.inlineMode(($) => {
	var usernames = $.query.split(' ');
	console.log(usernames);

	var results = [{
	}];
	$.answer([{text: 'test'}]);
});

var chats = [];

function quotify(s) {
	return '"' + s + '"';
}

function postscript(s) {
	var psList = [
	"That's you. That's what you sound like.",
	];
	var ps = " ";
	return s + ps;
}

function quote(username, s) {
	return s + "\n-" + username + "\n-Mock_bot"
}

function emojify(s) {
	words = s.split(/\s+/);
	return s;
}

function italicize(s) {
	return s;
}
