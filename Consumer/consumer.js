/**
 * http://usejsdoc.org/
 */
var kafka = require("kafka-node");
var Consumer = kafka.Consumer;
var client = new kafka.KafkaClient();
var sqlserver = require('./sqlserver');
var oracle = require('./oracle');

var consumer = new Consumer(client, 
	[ { topic: "errorLogs", partition: 0 },
	{ topic: "serverLogs", partition: 0 }], {
	autoCommit: true,
	autoCommitIntervalMs: 5000,
	encoding: 'utf8'
});

consumer.on("message", (message) => {
	if(message.topic === "errorLogs") { // log from spring server
		console.log("errorLogs : " + message.value);	
		oracle.insertSql(message.value);
	} else if(message.topic === "serverLogs") { // log from cpp server
		console.log("serverLogs : " + message.value);	
		sqlserver.insertSql(message.value);
	}
});

consumer.on('error', (err) => {
	console.log('error:', err);
});

consumer.on('offsetOutOfRange', (err) => {
    console.log('offsetOutOfRange:',err);
});