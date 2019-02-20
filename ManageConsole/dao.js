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

var directionCountPerDay = function(requestBody, callback) {
	
	// Query 
	var request = new mssql.Request();

	request.input('fromTime', common.gfn_stringToDate(requestBody.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(requestBody.date) + " 23:59:59");
	request.query('select count(*) as cnt from cso_direction where logdate between @fromTime and @toTime', function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log("error !");	
		} 
	});
};

var chattingCountPerDay = function(requestBody, callback) {
	
	// Query 
	var request = new mssql.Request();

	request.input('fromTime', common.gfn_stringToDate(requestBody.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(requestBody.date) + " 23:59:59");
	request.query('select count(*) as cnt from cso_chatting where logdate between @fromTime and @toTime', function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log("error !");	
		} 
	});
};

var chattingStatistics = function(requestBody, callback) {
	
	// Query 
	var request = new mssql.Request();

	request.input('fromTime', common.gfn_stringToDate(requestBody.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(requestBody.date) + " 23:59:59");
	
	request.query('select count(*) as cnt, cnt_hour  from (select DATEPART(hour,logdate) as cnt_hour from cso_chatting where logdate between @fromTime and @toTime) G group by G.cnt_hour', function (err, result) {
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log("error !");	
		} 
	});
};

module.exports.selectId = selectId;
module.exports.directionCountPerDay = directionCountPerDay;
module.exports.chattingCountPerDay = chattingCountPerDay;
module.exports.chattingStatistics = chattingStatistics;