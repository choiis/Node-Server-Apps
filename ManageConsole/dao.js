/**
 * http://usejsdoc.org/
 */
var sqlSession = require('./sqlSession');
var common = require('./common');

var mssql = sqlSession.mssql;

var selectId = function(params, callback) {
	
	// Query 
	var request = new mssql.Request();
	
	request.input('userid', params.userid);
	request.input('password', params.password);
	request.query('select * from cso_id with (nolock) where userid = @userid and password = @password', function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log(err);	
		} 
	});
};

var directionCountPerDay = function(params, callback) {
	
	// Query 
	var request = new mssql.Request();

	request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
	request.query('select count(*) as cnt from cso_direction with (nolock) where logdate between @fromTime and @toTime', function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log(err);	
		} 
	});
};

var chattingCountPerDay = function(params, callback) {
	
	// Query 
	var request = new mssql.Request();

	request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
	request.query('select count(*) as cnt from cso_chatting with (nolock) where logdate between @fromTime and @toTime', function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log(err);	
		} 
	});
};

var chattingStatistics = function(params, callback) {
	
	// Query 
	var request = new mssql.Request();
	request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
	var querystring = "select count(*) as cnt, cnt_hour from " +
			"(select DATEPART(hour,logdate) as cnt_hour " +
			"from cso_chatting with (nolock) where " +
			"logdate between @fromTime and @toTime) G group by G.cnt_hour";
	
	request.query(querystring, function (err, result) {
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log(err);	
		} 
	});
};

var chattingRanking = function(params, callback) {
	
	// Query 
	var request = new mssql.Request();

	request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
	
	var querystring = "select top 10 nickname ,count(*) as chatnum from cso_chatting with (nolock) " +
			"where logdate  between @fromTime and @toTime group by nickname order by chatnum desc";
	
	request.query(querystring, function (err, result) {
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log(err);	
		} 
	});
};

var chattingTotalRanking = function(params, callback) {
	
	// Query 
	var request = new mssql.Request();

	if(common.gfn_isNull(params.offset)) {
		request.input('num', 0);	
	} else {
		request.input('num', 10 * (params.offset - 1));
	}
	
	var querystring = "select nickname ,count(*) as chatnum from cso_chatting with (nolock) " +
			"group by nickname order by chatnum desc offset @num rows fetch next 10 rows only";
	
	request.query(querystring, function (err, result) {
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log(err);	
		} 
	});
};


module.exports.selectId = selectId;
module.exports.directionCountPerDay = directionCountPerDay;
module.exports.chattingCountPerDay = chattingCountPerDay;
module.exports.chattingStatistics = chattingStatistics;
module.exports.chattingRanking = chattingRanking;
module.exports.chattingTotalRanking = chattingTotalRanking;