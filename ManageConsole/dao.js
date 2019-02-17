/**
 * http://usejsdoc.org/
 */
var sqlSession = require('./sqlSession');
var common = require('./common');

var mssql = sqlSession.mssql;

var selectId = function(requestBody, callback) {
	
	// Query 
	var request = new mssql.Request();
	
	request.input('userid', requestBody.userid);
	request.input('password', requestBody.password);
	request.query('select * from cso_id where userid = @userid and password = @password', function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log("error !");	
		} 
	});
};

var directionCount = function(requestBody, callback) {
	
	// Query 
	var request = new mssql.Request();
	var times = common.gfn_getSecondInterval();
	request.input('fromTime', times.fromTime);
	request.input('toTime',  times.toTime);
	request.query('select count(*) as cnt from cso_direction where logdate between @fromTime and @toTime', function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log("error !");	
		} 
	});
};

var chattingCount = function(requestBody, callback) {
	
	// Query 
	var request = new mssql.Request();
	var times = common.gfn_getSecondInterval();
	request.input('fromTime', times.fromTime);
	request.input('toTime',  times.toTime);
	request.query('select count(*) as cnt from cso_chatting where logdate between @fromTime and @toTime', function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log("error !");	
		} 
	});
};

var loginCount = function(requestBody, callback) {
	
	// Query 
	var request = new mssql.Request();
	
	request.query('select count(*) as cnt from cso_id where loginyn = 1 ', function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log("error !");	
		} 
	});
};
module.exports.selectId = selectId;
module.exports.directionCount = directionCount;
module.exports.chattingCount = chattingCount;
module.exports.loginCount = loginCount;