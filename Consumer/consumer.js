/**
 * http://usejsdoc.org/
 */
var kafka = require("kafka-node");
var Consumer = kafka.Consumer;
var client = new kafka.KafkaClient();

var  consumer = new Consumer(client, 
	[ { topic: "errorLogs", partition: 0 },
		{ topic: "serverLog", partition: 0 }], {
	autoCommit: true,
	autoCommitIntervalMs: 5000,
	encoding: 'utf8'
});

var oracledb = require('oracledb');
oracledb.autoCommit = true;

var fs = require('fs'); // 파일목록 탐색
var conn;

fs.readFile('oracle.properties', 'utf8', (err, data) => {
	var json = JSON.parse(data);
	var config = {
		user: json.user,
		password: json.password,
		connectString: json.connectString
	};

	// Global connection으로 만듬
	oracledb.getConnection(config, (err, con) => {
		if(err == null) {
			console.log("Oracle connection success");
			conn = con;
		}
	});
});


consumer.on("message", (message) => {
	if(message.topic === "errorLogs") { // log from spring server
		console.log("errorLogs : " + message.value);	
		if(conn != null) {
			//쿼리문 실행 
	        conn.execute(message.value, (err,result) => {
	            if(err) {
	                console.log(err);
	        	}
	        });	
		}

	} else if(message.topic === "serverLogs") { // log from cpp server
		console.log("serverLogs : " + message.value);	
	}
});

consumer.on('error', (err) => {
	console.log('error:', err);
});

consumer.on('offsetOutOfRange', (err) => {
    console.log('offsetOutOfRange:',err);
});