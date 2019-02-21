/**
 * http://usejsdoc.org/
 */
var mssql = require('mssql');
var fs = require('fs'); // 파일목록 탐색

fs.readFile('conf.properties', 'utf8', function(err, data){
	var json = JSON.parse(data);

	var config = {
	    user: json.user,
	    password: json.password,
	    server: json.server,
	    port : json.port,
	    database: json.database
	};

	// Global connection으로 만듬
	mssql.connect(config);	
});

module.exports.mssql = mssql;