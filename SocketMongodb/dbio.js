/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');

//===== 데이터베이스 연결 =====//

//몽고디비 모듈 사용
var MongoClient = require('mongodb').MongoClient;

//데이터베이스 객체를 위한 변수 선언
var database;
//데이터베이스 스키마 객체를 위한 변수 선언
var UserSchema;
//데이터베이스 모델 객체를 위한 변수 선언
var UserModel;

//데이터베이스에 연결
function connectDB() {
	// 데이터베이스 연결 정보
	var databaseUrl = 'mongodb://localhost:27017/local';
	
	mongoose.Promise = global.Promise;
	mongoose.connect(databaseUrl);
	database = mongoose.connection;
	
	database.on('error', console.error.bind(console, 'mongoose connection error'));
	database.on('open', function() {
		console.log("데이터베이스에 연결되었습니다 : " + databaseUrl);
	
		UserSchema = mongoose.Schema({
			id : {type : String, required : true , unique : true},
			name : {type : String, required : true},
			password : {type : String, index : 'hashed'},
			age : {type : Number , 'default' : -1},
			created_at : {type : Date , index : {unique : false } ,'default' : Date.now},
			updated_at : {type : Date , index : {unique : false } ,'default' : Date.now}
		});

		
		UserSchema.static('findById', function(id, callback) {
			return this.find({id : id},callback);
		});
		
		UserSchema.static('findAll', function(callback) {
			return this.find({},callback);
		});
		
		UserSchema.static('removeById', function(id, callback) {
			return this.remove({id : id},callback);
		});
		
		
		UserModel = mongoose.model("users2" , UserSchema);
	
	});
	
	database.on('disconnected', function() {
		console.log("재연결");
		setInterval(connectDB , 5000);
	});
}


//사용자를 인증하는 함수
var authUser = function(requestbody, callback) {
	
	  // 요청 파라미터 확인
 var id = requestbody.id;
 var password = requestbody.password;
 // 1. 아이디를 이용해 검색
	UserModel.findById(id, function(err, results) {
		if (err) {
			callback(err, null);
			return;
		}
		console.dir(results);
		
		if (results.length > 0) {
			
			// 2. 패스워드 확인
			if (results[0]._doc.password === password) {
				
				callback(null, results);
			} else {
			
				callback(null, null);
			}
			
		} else { 
	    	callback(null, null);
	    }
		
	});
};

var addUser = function(requestbody , callback) {

	// 요청 파라미터 확인
	var id = requestbody.id;
	var password = requestbody.password;
	var name = requestbody.name;
	var age = requestbody.age;
	
	var users = new UserModel({"id":id , "password":password , "name":name , "age" : age});
	
	users.save(function(err, result) {

		if(err) {
			callback(err, null);
			return;
		}

		callback(null, result);
		
	});
	
};

var selectAllUser = function(requestbody , callback) {

	UserModel.findAll(function(err, result) {
		if (err) {
			callback(err, null);
			return;
		}
		
		callback(null, result);
	});
};


var removeById = function(requestbody , callback) {

	var id = requestbody.removeid;
	
	UserModel.removeById(id, function(err, result) {
		if (err) {
			callback(err, null);
			return;
		}
		
		callback(null, result);
	});
};

module.exports.connectDB = connectDB;
module.exports.UserModel = UserModel;
module.exports.authUser = authUser;
module.exports.addUser = addUser;
module.exports.selectAllUser = selectAllUser;
module.exports.removeById = removeById;