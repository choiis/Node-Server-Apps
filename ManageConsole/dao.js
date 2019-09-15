/**
 * http://usejsdoc.org/
 */
var sqlSession = require('./sqlSession');
var common = require('./common');

var mssql = sqlSession.mssql;

var selectId = ( async (params) => {
	
	// Query 
	var request = new mssql.Request();
	
	request.input('userid', params.userid);
	request.input('password', params.password);
	var querystring = "select * from cso_id with (nolock) where userid = @userid and password = @password";
	
	let data = await request.query(querystring)
	.then((result) => {
		return result.recordset;
	})
	.catch((err) => {
		console.log(err);
	});
	return data;
});

var directionCountPerDay = ((params, callback) => {
	
	// Query 
	var request = new mssql.Request();

	request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
	var querystring = "select count(*) as cnt from cso_direction with (nolock) " +
			"where logdate between @fromTime and @toTime";
	
	request.query(querystring, function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log(err);	
		} 
	});
});

var chattingCountPerDay = ((params, callback) => {
	
	// Query 
	var request = new mssql.Request();

	request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
	var querystring = "select count(*) as cnt from cso_chatting with (nolock)" +
			" where logdate between @fromTime and @toTime";
	
	request.query(querystring, function (err, result) {
	
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log(err);	
		} 
	});
});

var chattingStatistics = ((params, callback) => {
	
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
});

var chattingRanking = ((params, callback) => {
	
	// Query 
	var request = new mssql.Request();

	request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
	request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
	var querystring = "select top 10 nickname ,count(*) as chatnum from cso_chatting with (nolock) " +
			"where logdate between @fromTime and @toTime group by nickname order by chatnum desc";
	
	request.query(querystring, function (err, result) {
		// ... error checks 
		if(!err) {
			callback(result.recordset);	    	
		} else { 
			console.log(err);	
		} 
	});
});

var chattingTotalRanking = ((params, callback) => {
	
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
});


var calcDaily = ( async () => {
	// Query 
	var request = new mssql.Request();
	
	let data = await request.query("exec calc_daily 1").then(function() {
		return 1;
	})
	.catch((err) => {
		console.log(err);
	});
	return data;
});


var uniqueUser = ( async (params) => {
	
	// Query 
	var request = new mssql.Request();

	request.input('regdate', common.gfn_stringToDate(params.date));
	var querystring = "select uniqueuser from daily with (nolock) where regdate = @regdate";
	
	let data = await request.query(querystring)
	.then((result) => {
		return result.recordset;
	})
	.catch((err) => {
		console.log(err);
	});
	return data;
});

module.exports.selectId = selectId;
module.exports.directionCountPerDay = directionCountPerDay;
module.exports.chattingCountPerDay = chattingCountPerDay;
module.exports.chattingStatistics = chattingStatistics;
module.exports.chattingRanking = chattingRanking;
module.exports.chattingTotalRanking = chattingTotalRanking;
module.exports.calcDaily = calcDaily;
module.exports.uniqueUser = uniqueUser;