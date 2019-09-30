/**
 * http://usejsdoc.org/
 */
var kafka = require("kafka-node");
var Consumer = kafka.Consumer;
var client = new kafka.KafkaClient();

var  consumer = new Consumer(client, 
	[ { topic: "errorLogs", partition: 0 }], {
	autoCommit: true,
	autoCommitIntervalMs: 5000,
	encoding: 'utf8'
});

consumer.on("message", function(message) {
	if(message.topic === "errorLogs") {
		console.log(message.value);	
	}
});

consumer.on('error', function (err) {
	console.log('error:', err);
});

consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:',err);
});