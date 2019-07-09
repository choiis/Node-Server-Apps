/**
 * 
 */

var botkit = require('botkit');
var axios = require("axios");
var cheerio = require("cheerio");
var fs = require("fs");
var cron = require('node-cron');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var controller = botkit.slackbot();

var menuList = [];
var bot;
var menuUrl;
controller.hears(["오늘의메뉴","오늘의식사","오늘의반찬"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
	var now = new Date();
	var hour = now.getHours();
	if((hour >= 11 && hour <= 13) || (hour >= 17 && hour <= 19)) {
		console.log(menuList);
		for(var i = 0; i < menuList.length ; i++) {
			bot.reply(message, menuList[i].img);
			bot.reply(message, menuList[i].menuname);
		}	
	} else {
		bot.reply(message, "아직 밥시간이 아닙니다");
	}
});

controller.hears(["배고파","뭐먹지"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
	bot.reply(message, "메뉴를 물어봐 주세요");
});

controller.hears(['전체공지'],["direct_message","direct_mention","mention","ambient"], function(bot, message) {
	bot.reply(message, "<!here> " + message.text.replace("전체공지",""));
});

// 40분 17시 매주 월-금 배치 프로그램 실행
cron.schedule('40 17 * * 1-5', () => {
	console.log("batch program");
	bot.say({ text: 'dinner time', channel: '5floor' });
	for(var i = 0; i < menuList.length ; i++) {
		bot.say({ text: menuList[i].img, channel: '5floor' });
		bot.say({ text: menuList[i].menuname, channel: '5floor' });
	}
}).start();



var crawlerMenu = function() {
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
};

// 20분 11시 매주 월-금 배치 프로그램 실행
cron.schedule('20 11 * * 1-5', () => {
	crawlerMenu();
}).start();

// 20분 17시 매주 월-금 배치 프로그램 실행
cron.schedule('20 17 * * 1-5', () => {
	crawlerMenu();
}).start();



//설정파일 읽어들이기
fs.readFile('conf.properties', 'utf8', (err, data) => {
	
	if(err) {
		throw new Error('file read error');
	}
	
	var json = JSON.parse(data);
	menuUrl = json.menuUrl;
	var key = json.token;
	
	bot = controller.spawn({
		token : key
	});

	bot.startRTM((err, bot, payload) => {
		if(err) {
			console.log(err);
			throw new Error('could not connect to slack');
		}
	});

	crawlerMenu();
});