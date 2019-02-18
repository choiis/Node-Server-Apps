// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , expressSession = require('express-session')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');
var fs = require('fs'); // 파일목록 탐색
var util = require('util');
var mime = require('mime');
var pm2 = require('pm2');
var dao = require('./dao');
// 익스프레스 객체 생성
var app = express();

var router = express.Router();

var net=require('net');
var client = new net.Socket();

//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');

app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: true }));
// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());
// cookie-parser 설정
app.use(cookieParser());
// session객체 설정
app.use(expressSession({
	secret : 'my key',
	resave : true,
	saveUninitialized : true
}));

// 서버 파일 디렉토리
var directory = 'D:/SocketApplication/Server/Server/Downloads';

var cssSheet = {
	style : fs.readFileSync('views/style.css','utf8')
};

// Process 연결
pm2.connect(function(err) {
	
});

//메모리 CPU 모니터
router.route('/monitor').post(function(req, res) {
	
	pm2.describe("Server.exe", function(err, des) {
		res.send(des);
	});
});

//메모리 CPU 모니터
router.route('/serverSwitch').post(function(req, res) {
	if(req.body.off === "1") { // 서버켜기
		pm2.start("D:/SocketApplication/Server/Release/Server.exe",{
			name : "Server.exe",
			watch : true
		}, function(err, apps) {
			// 채팅서버는 같은 PC에서 동작한다
			// 서버 on 후에 연결한다
			client.connect(1234, 'localhost');
			
			res.send({flag:0});
		});
	} else {
		pm2.delete("Server.exe", function(err, des) {
			console.log("process off");
			res.send({flag:1});
		});
	}
});

// 기본 Path
app.get('/', function (req, res) {

	res.render('index',{
		myCss: cssSheet
	});
});

// 로그인 router
router.route('/login').post(function(req, res) {
	
	var rows = dao.selectId(req.body , function(data) {
		if(data.length > 0 ) {
			console.log("login okey");
			// 세션저장
			req.session.user = {
				userid : data[0].userid,
				nickname : data[0].nickname,
				lastlogdate : data[0].lastlogdate,
				adminyn : data[0].adminyn
			};
			res.send(data);
		} else {
			console.log("login fail");
			res.send(data);
		}
	});
});

// 로그아웃 router
router.route('/logout').get(function(req, res) {
	
	if(req.session.user) {
		
		req.session.destroy(function(err) {
			res.render('index',{
				myCss: cssSheet
			});
		});
	} else {
		res.render('index',{
			myCss: cssSheet
		});
	}
});

// 메인화면 router
router.route('/main').get(function(req, res) {
	if(req.session.user) { // 세선정보 있음

		if(req.session.user.adminyn === 1) {

			res.render('main',{
				myCss: cssSheet, 
				nickname : req.session.user.nickname,
				lastlogdate : req.session.user.lastlogdate.substr(0,10),
				lastlogtime : req.session.user.lastlogdate.substr(11,8)
			});	
		} else {
			res.render('construction',{myCss: cssSheet});
		}	
		
	} else { // 세션정보 없음
		res.render('index',{
			myCss: cssSheet
		});
	}
	
});

// 멤버 강퇴
router.route('/ban').post(function(req, res) {
		if(req.session.user) { // 세선정보 있음
		var banName = new Buffer(req.body.banName, "utf8");
		// Chatting Server의 Packet유형으로 전달한다
		var packet = new Buffer(banName.length + 10);
		// 0 2번째 short 바디사이즈
		packet[0] = banName.length + 10;
		// 6 10번째 direction
		packet[6] = 21; // direction
		for(var i = 0; i < banName.length; i++) {
			packet[i + 10] = banName[i]; // msg
		}
		client.write(packet);
	
		client.on('data', function(data) {
		
		});
	}
});

// 1초당 지시패킷
router.route('/directionCount').post(function(req, res) {
	if(req.session.user) { // 세선정보 있음
		dao.directionCount(req.body , function(data) {
			res.send(data);
		});
	}
});

// 1초당 채팅패킷
router.route('/chattingCount').post(function(req, res) {	
	if(req.session.user) { // 세선정보 있음
		dao.chattingCount(req.body , function(data) {
			res.send(data);
		});
	}
});

//1초당 지시패킷
router.route('/directionCountPerDay').post(function(req, res) {
	if(req.session.user) { // 세선정보 있음
		dao.directionCountPerDay(req.body , function(data) {
			res.send(data);
		});
	}
});

// 1초당 채팅패킷
router.route('/chattingCountPerDay').post(function(req, res) {	
	if(req.session.user) { // 세선정보 있음
		dao.chattingCountPerDay(req.body , function(data) {
			res.send(data);
		});
	}
});

// 로그인 유저수
router.route('/loginCount').post(function(req, res) {	
	if(req.session.user) { // 세선정보 있음
		/*
		// Chatting Server의 Packet유형으로 전달한다
		var packet = new Buffer(20);
		// 0 2번째 short 바디사이즈
		packet[0] = 20;
		// 6 10번째 direction
		packet[6] = 20; // direction
		client.write(packet);

		client.on('data', function(data) {
			var cntByte = data.slice(2, 6);
			var json = {};
			json.cnt = cntByte.readUInt8();
			res.sendStatus(200).json(json);
		});
		*/
		dao.loginCount(req.body , function(data) {
		 	res.send(data);
		});
	}
});

// 서버의 파일 확인
router.route('/file').post(function(req, res) {
	if(req.session.user) { // 세선정보 있음
		var fs = require('fs');
	 
		fs.readdir(directory, function(error, filelist){
			res.send(filelist);
		});
	}
});

// 파일 다운로드
router.route('/fileDown/:name').get(function(req, res) {
	if(req.session.user) { // 세선정보 있음
		var orgName = req.params.name;
		var fileDir = directory + "/" + orgName;
	
		res.download(fileDir);
	}
});

// 라우터 등록
app.use('/',router);

// 예외화면
app.all('*',function(req,res) {
	res.status(404).send('<h1>Page Not Found</h1>');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
