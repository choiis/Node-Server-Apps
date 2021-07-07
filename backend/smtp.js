
const nodemailer = require('nodemailer');

const fs = require('fs'); // 파일목록 탐색

let transporter;
let frommail;
let tomail;

fs.readFile('conf.properties', 'utf8', function(err, data) {
	let json = JSON.parse(data);

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

module.exports = {
	
	sendMail(msg) {

		return new Promise((resolve, reject) => {
			let mail = {
				from : frommail,
				to : tomail,
				subject : "Warning",
				text : msg
			};
					
			transporter.sendMail(mail, function(err, result) {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			});
		})
		
	}

};