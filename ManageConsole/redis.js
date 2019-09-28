
var redis = require('then-redis');
var createClient = require('then-redis').createClient

var fs = require('fs'); // 파일목록 탐색
var db;
fs.readFile('conf.properties', 'utf8', function(err, data) {
	var json = JSON.parse(data);
	db = createClient({
		"host" :json.redisServer,
		"port" :json.redisPort});
	
});

var set = ((key, value) => {
	
	db.set(key, value);
});

var get = ( async (key) => {
	
	let data = await db.get(key)
	.then((result) => {
		return result;
	})
	.catch((err) => {
		console.log(err);
	})
	return data;
});

var zrevrange = ( async (key) => {
	
	let data = await db.zrevrange(key, 0, -1, 'withscores')
	.then((array) => {
		var result = new Array();
		for (var i = 0; i < array.length; i+=2) {
			var json = {};
			json[array[i]] = array[i + 1];
			result.push(json);
		}
		return result;
	})
	.catch((err) => {
		console.log(err);
	});
	return data;
});

var zadd= ((key , number, value) => {
	
	db.zadd(key, number, value);
});

module.exports.set = set;
module.exports.get = get;
module.exports.zrevrange = zrevrange;
module.exports.zadd = zadd;