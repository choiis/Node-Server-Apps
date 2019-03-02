/**
 * 데이터베이스 사용하기
 * 
 * 몽고디비에 연결하고 클라이언트에서 로그인할 때 데이터베이스 연결하도록 만들기
 * 
 * 웹브라우저에서 아래 주소의 페이지를 열고 웹페이지에서 요청 http://localhost:3000/public/login.html
 * 
 * @date 2016-11-10
 * @author Mike
 */

// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

var socketio = require('socket.io');
var cors = require('cors');

// Session 미들웨어 불러오기
var expressSession = require('express-session');

var dbio = require('./dbio');

// 익스프레스 객체 생성
var app = express();

//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// 기본 속성 설정
app.set('port', 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());
 
// cookie-parser 설정
app.use(cookieParser());
// cors 미들웨어 등록
app.use(cors());
// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

// ===== 라우팅 함수 등록 =====//

// 라우터 객체 참조
var router = express.Router();


//기본 Path
app.get('/', function(req, res) {
	res.render('index');
});

// 로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/login').post(function(req, res) {
    
    // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
	dbio.authUser(req.body, function(err, data) {
		if (err) {throw err;}
			
        // 조회된 레코드가 있으면 성공 응답 전송
		if (data.length > 0) {
				
			// 세션저장
			req.session.user = {
				id : data[0].id,
				name : data[0].name
			};
			res.send(data);
			
		} else {  // 조회된 레코드가 없는 경우 실패 응답 전송
			res.send(data);
		}
	});
	
});


//메인화면 router
router.route('/main').get(function(req, res) {
	if (req.session.user) { // 세선정보 있음

		res.render('main', {
			nickname : req.session.user.name
		});

	} else { // 세션정보 없음
		res.render('index');
	}

});

// 유저추가 router
router.route('/addUser').get(function(req, res) {
	res.render('addUser');
});

// 유저리스트 router
router.route('/userList').get(function(req, res) {
	res.render('userList');
});

// 사용자 추가 라우팅 함수 - 클라이언트에서 보내오는 데이터를 이용해 데이터베이스에 추가
router.route('/adduser').post(function(req, res) {

    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
	dbio.addUser(req.body, function(err, result) {
		if (err) {
			throw err;
		}
			
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>사용자 추가 성공</h2>');
		res.end();
		
	});
});

//사용자 리스트 함수
router.route('/listuser').post(function(req, res) {

	// 1. 모든 사용자 검색		
	dbio.selectAllUser(req.body,function(err, results) {
		// 에러 발생 시, 클라이언트로 에러 전송
		if (err) {
			console.error('사용자 리스트 조회 중 에러 발생 : ' + err.stack);
                
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
			res.end();
                
            return;
        }	
		res.status(200).send(results);
	});
});


//사용자 삭제 함수
router.route('/removeById').post(function(req, res) {

	// 1. 모든 사용자 검색		
	dbio.removeById(req.body,function(err, results) {
		// 에러 발생 시, 클라이언트로 에러 전송
		if (err) {
			console.error('사용자 리스트 조회 중 에러 발생 : ' + err.stack);
                
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
			res.end();
                
            return;
        }	
		
		res.status(200).send(results);
	});
});
// 라우터 객체 등록
app.use('/', router);

//예외화면
app.all('*', function(req, res) {
	res.render('404');
});


app.use( errorHandler );
// Express 서버 시작
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

  	// 데이터베이스 연결을 위한 함수 호출
  	dbio.connectDB();
});

var io = socketio.listen(server);
console.log('서버 소켓 listen');

io.sockets.on('connection', function(socket) {
	console.log('connection info ' , socket.request.connection._peername);
	// socket.remoteAddress = socket.request.connection._peername.address;
	// socket.remotePort = socket.request.connection._peername.port;
	
	socket.on('message', function(message) {
		var msg = message.nickname + ":" + message.message;
		io.sockets.emit('message', msg);
	});
});

var process = require('process');

// 에러 핸들
process.on('uncaughtException', function(err) {
	console.error('예기치 못한 에러', err);
});

var request = http.request({
	path : "/"
}, function(res) {
	res.on("error", function() {
		console.log("error");
	});
});