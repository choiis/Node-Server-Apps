/**
 * http://usejsdoc.org/
 */
const mssql = require('mssql');
const fs = require('fs'); // 파일목록 탐색

fs.readFile('conf.properties', 'utf8', function(err, data) {
	let json = JSON.parse(data);

	let config = {
		user : json.user,
		password : json.password,
		server : json.server,
		port : json.port,
		database : json.database
	};

	// Global connection으로 만듬
	mssql.connect(config);
});

module.exports.mssql = mssql;