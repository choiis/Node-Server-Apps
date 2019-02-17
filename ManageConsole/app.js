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

var dao = require('./dao');

// 익스프레스 객체 생성
var app = express();

var router = express.Router();

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

var directory = 'C:/Users/최인성/Desktop/인성';

// 기본 Path
app.get('/', function (req, res) {
	res.render('index');
});

router.route('/login').post(function(req, res) {
	
	var rows = dao.selectId(req.body , function(data) {
		if(data.length > 0 ) {
			console.log("login okey");
			// 세션저장
			req.session.user = {
				userid : data[0].userid,
				nickname : data[0].nickname
			};
			res.send(data);
		} else {
			console.log("login fail");
			res.send(data);
		}
	});
});

router.route('/main').get(function(req, res) {
	if(req.session.user) { // 세선정보 있음
		// var context = {nickName:req.session.user.nickname};
		//res.render('main');
		var context = {nickName:req.session.user.nickname};
		req.app.render('main', context, function(err, html) {
			
			res.end(html);
		});
	} else { // 세션정보 없음
		res.render('index');
	}
	
});

router.route('/directionCount').post(function(req, res) {
	dao.directionCount(req.body , function(data) {
		res.send(data);
	});
});


router.route('/chattingCount').post(function(req, res) {	
	dao.chattingCount(req.body , function(data) {
		res.send(data);
	});
});

router.route('/loginCount').post(function(req, res) {	
	dao.loginCount(req.body , function(data) {
		res.send(data);
	});
});

router.route('/file').post(function(req, res) {
	var fs = require('fs');
	 
	fs.readdir(directory, function(error, filelist){
		res.send(filelist);
	});
	
});

router.route('/fileDown/:name').get(function(req, res) {
	var orgName = req.params.name;
	var fileDir = directory + "/" + orgName;
	
	res.download(fileDir);
});

app.use('/',router);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
