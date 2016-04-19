//"message":{"message_id":3,"from":{"id":191069934,"first_name":"Philip","last_name":"Smith"},"chat":{"id":191069934,"first_name":"Philip","last_name":"Smith","type":"private"},"date":1461109451,"text":"Hsjdl"}}]}
var bot = require('telegram-bot-bootstrap');
var fs = require('fs');
var chat = 191069934; //replace this with your chat id noted previously 
var text="this is my sample test"; //replace this with your message
var token = "217736145:AAGHjRNRwjIfEYxesCsU_NuhJo01EJTebAo"; //replace token with the token given by botfather
var Alice = new bot(token);
Alice.getUpdates().then(console.log) // you'll see an update message. Look for your user_id in "message.from.id"
// Once you get your id to message yourself, you may:
Alice.sendMessage(chat, text) // you'll receive a message from Alice..then(console.log)// ? optional, will log the successful message sent over HTTP