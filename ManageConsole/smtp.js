
var nodemailer = require('nodemailer');

var fs = require('fs'); // 파일목록 탐색


var transporter;

var frommail;
var tomail;

fs.readFile('conf.properties', 'utf8', function(err, data) {
	var json = JSON.parse(data);

	transporter = nodemailer.createTransport(({
		host : json.smtphost,
		port : json.smtpport,
		secure : false,
		tls: {
	         rejectUnauthorized: false
	    }
	}));

	frommail = json.frommail;
	tomail = json.tomail;
});

var sendMail = function(msg) {
	
	var mail = {
		from : frommail,
		to : tomail,
		subject : "Warning",
		text : msg
	};
			
	transporter.sendMail(mail, function(err, result) {
		if(err) {
			console.log("mail send err" + err);
		}
	});
};

module.exports.sendMail = sendMail;