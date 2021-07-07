const redis = require('then-redis');
const createClient = require('then-redis').createClient

const fs = require('fs'); // 파일목록 탐색
let db;

fs.readFile('redis.properties', 'utf8', function(err, data) {
    let json = JSON.parse(data);
    db = createClient({
        "host": json.redisServer,
        "port": json.redisPort
    });

});

module.exports.set = async(key, value) => {
    let data = await db.set(key, value)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            throw err;
        })
    return data;
};

module.exports.get = async(key) => {

    let data = await db.get(key)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            throw err;
        })
    return data;
};

module.exports.zrevrange = async(key, cnt) => {

    let data = await db.zrevrange(key, 0, cnt, 'withscores')
        .then((array) => {
            let result = new Array();
            for (var i = 0; i < array.length; i += 2) {
                let json = {
                    "key": array[i],
                    "value": array[i + 1]
                };
                result.push(json);
            }
            return result;
        })
        .catch((err) => {
            throw err;
        });
    return data;
};

module.exports.zadd = async(key, number, value) => {

    let data = await db.zadd(key, number, value).then((result) => {
            return result;
        })
        .catch((err) => {
            throw err;
        })
    return data;
};

module.exports.hmget = async(key, field) => {

    let data = await db.hmget(key, field)
        .then((result) => {

            return result;
        })
        .catch((err) => {
            throw err;
        });
    return data;
};

module.exports.hgetall = async(key) => {

    let data = await db.hgetall(key)
        .then((result) => {

            return result;
        })
        .catch((err) => {
            throw err;
        });
    return data;
};