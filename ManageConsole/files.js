/**
 * http://usejsdoc.org/
 */

var express = require('express');
var fs = require('fs'); // 파일목록 탐색
var router = express.Router();

var HttpStatus = require('http-status-codes');

var directory;

//서버의 파일 확인
router.get('/file', (req, res) => {
	if (req.session.user) { // 세선정보 있음
		var fs = require('fs');

		fs.readdir(directory, function(error, filelist) {
			res.status(HttpStatus.OK).send(filelist);
		});
	} else {
		res.status(HttpStatus.FORBIDDEN).send({});
	}
});

//파일 다운로드
router.get('/fileDown/:name', (req, res) => {
	if (req.session.user) { // 세선정보 있음
		var orgName = req.params.name;
	
		var fileDir = directory + "/" + orgName;
		fs.exists(fileDir, function(exist) {

			if(exist) {
				res.status(HttpStatus.OK).download(fileDir);		
			} else {
				res.status(HttpStatus.NOT_FOUND).send('file not exist');
			}
		})
	} else {
		res.status(HttpStatus.FORBIDDEN).send({});
	}
});

//파일 삭제
router.delete('/fileDelete/:name', (req, res) => {
	if (req.session.user) { // 세선정보 있음
		var orgName = req.params.name;
		var fileDir = directory + "/" + orgName;
	
		fs.exists(fileDir, function(exist) {

			if(exist) {
				fs.unlink(fileDir, (err) => {
					if(err) {
						throw err;
					}
					console.log('file deleted');
					res.status(HttpStatus.OK).send(HttpStatus.OK);
				});		
			} else {
				res.status(HttpStatus.NOT_FOUND).send('file not exist');
			}
		})	
	} else {
		res.status(HttpStatus.FORBIDDEN).send({});
	}
});

module.exports.directory = directory;
module.exports = router;