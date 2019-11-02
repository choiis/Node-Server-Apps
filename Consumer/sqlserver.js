
var mssql = require('mssql');
var fs = require('fs'); // 파일목록 탐색

var init = ( () => {

	fs.readFile('sqlserver.properties', 'utf8', function(err, data) {
		var json = JSON.parse(data);

		var config = {
			user : json.user,
			password : json.password,
			server : json.server,
			port : json.port,
			database : json.database
		};
		// Global connection으로 만듬
		mssql.connect(config).then(() => {
			console.log("sqlserver connection success");
		})
		.catch((err) => {
			console.log(err);
		});;
	});
	
});

var insertSql = ( async (sql) => {
	// Query 
	var request = new mssql.Request();
	
	let data = await request.query(sql).then(function() {
		return 1;
	})
	.catch((err) => {
		console.log(err);
	});
	return data;
});


module.exports.init = init;
module.exports.insertSql = insertSql;