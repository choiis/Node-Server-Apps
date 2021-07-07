// 익스프레스 객체 생성
var express = require('express');

var router = express.Router();
const dao = require('./dao');

const common = require('./common');
const smtp = require('./smtp');
const redis = require('./redis');
const cron = require('node-cron');
const pm2 = require('pm2');

const HttpStatus = require('http-status-codes');

//1초당 지시패킷
router.get('/directionCountPerDay/:date', async (req, res) => {
	try {
		let data = await dao.directionCountPerDay(req.params);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});

// 1초당 채팅패킷
router.get('/chattingCountPerDay/:date', async (req, res) => {
	try {
		let data = await dao.chattingCountPerDay(req.params);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});

// 시간별 통계
router.get('/chattingStatistics/:date', async (req, res) => {
	try {
		let data = await dao.chattingStatistics(req.params);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});

// 채팅수 통계
router.get('/chattingRanking/:date', async (req, res) => {
	try {
		let data = await dao.chattingRanking(req.params);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});

//채팅수 통계
router.get('/chattingTotalRanking/:offset', async (req, res) => {
	try {
		let data = await dao.chattingTotalRanking(req.params);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});

//접속유저수 통계
router.get('/uniqueUser/:date', async (req, res) => {
	
	try {
		let data = await dao.uniqueUser(req.params);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}		
});

// 파일전송일별통계
router.get('/fileRecvDataPerDay/:date', async (req, res) => {
	
	try {
		let data = await dao.fileRecvDataPerDay(req.params);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});

// 파일전송닉네임별통계
router.get('/fileRecvDataByNickName/:nickname', async (req, res) => {
	
	try {
		let data = await dao.fileRecvDataByNickName(req.params);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});


//zrevrange 
router.get('/zrevrange/:key/:cnt', async (req, res) => {

	try {
		let data = await redis.zrevrange(req.params.key, req.params.cnt);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});

//redis get 
router.get('/redisGet/:key', async (req, res) => {

	try {
		let data = await redis.get(req.params.key);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});


//redis hmget 
router.get('/hmget/:key/:field', async (req, res) => {

	try {
		let data = await redis.hmget(req.params.key, req.params.field);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});

//redis hgetall 
router.get('/hgetall/:key', async (req, res) => {

	try {
		let data = await redis.hgetall(req.params.key);
		res.status(HttpStatus.OK).send(data);
	} catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
	}
});


//매일 00시 20분 배치프로그램 실행 => daily Statistics
cron.schedule('20 13 * * *', async () => {
	try {
		let data = await dao.calcDaily();
		
	} catch (err) {
		throw err;
	}
}).start();

module.exports = router;