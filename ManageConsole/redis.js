
var redis = require('redis');
var client;

var fs = require('fs'); // 파일목록 탐색

fs.readFile('conf.properties', 'utf8', function(err, data) {
	var json = JSON.parse(data);
	client = redis.createClient(json.redisPort, json.redisServer);
	
});

var set = ((key, value) => {
	
	client.set(key, value);
});

var get = ((key) => {
	
	client.get(key, (err, reply) => {
		return reply;
	});
});

var zrevrange = ((key) => {
		
	client.zrevrange(key, 0, -1, 'withscores', (err, sset) => {
		  return sset;
	});
});

var zadd= ((key , number, value) => {
	
	client.zadd(key, number, value);
});

module.exports.set = set;
module.exports.get = get;
module.exports.zrevrange = zrevrange;
module.exports.zadd = zadd;