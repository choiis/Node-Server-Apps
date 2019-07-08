/**
 * 
 */

var botkit = require('botkit');
var axios = require("axios");
var cheerio = require("cheerio");
var fs = require("fs");
var cron = require('node-cron');

var controller = botkit.slackbot();

var menuList = [];
var bot;
controller.hears(["오늘의메뉴"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
	
	console.log(menuList);
	for(var i = 0; i < menuList.length ; i++) {
		bot.reply(message, menuList[i].img);
		bot.reply(message, menuList[i].menuname);
	}
});

// 40분 17시 매주 월-금 배치 프로그램 실행
cron.schedule('40 17 * * 1-5', function () {
	console.log("batch program");
	bot.say({ text: 'dinner time', channel: '5floor' });
	for(var i = 0; i < menuList.length ; i++) {
		bot.say({ text: menuList[i].img, channel: '5floor' });
		bot.say({ text: menuList[i].menuname, channel: '5floor' });
	}
}).start();


//설정파일 읽어들이기
fs.readFile('conf.properties', 'utf8', (err, data) => {
	
	if(err) {
		throw new Error('file read error');
	}
	
	var json = JSON.parse(data);
	var menuUrl = json.menuUrl;
	var key = json.token;
	
	bot = controller.spawn({
		token : key
	});

	bot.startRTM(function(err, bot, payload) {
		if(err) {
			console.log(err);
			throw new Error('could not connect to slack');
		}
	});

	
	axios.get(menuUrl).then(html => {
		var $ = cheerio.load(html.data);
		var figure = $("figure");
		var dataList = [];
		
		figure.each(function(i, element) {
			dataList[i] = {
				img : $(this).find("img").attr("src"),
				menuname : $(this).find("figcaption").text()
			};
		});
		menuList = dataList;
		return dataList;
	});
});
