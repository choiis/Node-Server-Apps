/**
 * http://usejsdoc.org/
 */
const sqlSession = require('./sqlSession');
const common = require('./common');

const mssql = sqlSession.mssql;

module.exports = {
	
	async selectId(params) {
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
			throw err;
		});
		return data;
	},

	async directionCountPerDay(params, callback) {
		// Query 
		var request = new mssql.Request();
	
		request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
		request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
		var querystring = "select count(*) as cnt from cso_direction with (nolock) " +
				"where logdate between @fromTime and @toTime";
		
		let data = await request.query(querystring)
		.then((result) => {
			return result.recordset;
		})
		.catch((err) => {
			throw err;
		});
		return data;
	},

	async chattingCountPerDay(params) {
		// Query 
		var request = new mssql.Request();
	
		request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
		request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
		var querystring = "select count(*) as cnt from cso_chatting with (nolock)" +
				" where logdate between @fromTime and @toTime";
		
		let data = await request.query(querystring)
		.then((result) => {
			return result.recordset;
		})
		.catch((err) => {
			throw err;
		});
		return data;
	},
	
	async chattingStatistics(params) {
		// Query 
		var request = new mssql.Request();
		request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
		request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
		var querystring = "select count(*) as cnt, cnt_hour from " +
				"(select DATEPART(hour,logdate) as cnt_hour " +
				"from cso_chatting with (nolock) where " +
				"logdate between @fromTime and @toTime) G group by G.cnt_hour";
		
		let data = await request.query(querystring)
		.then((result) => {
			return result.recordset;
		})
		.catch((err) => {
			throw err;
		});
		return data;
	},

	async chattingRanking(params) {
		// Query 
		var request = new mssql.Request();
	
		request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
		request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
		var querystring = "select top 10 nickname ,count(*) as chatnum from cso_chatting with (nolock) " +
				"where logdate between @fromTime and @toTime group by nickname order by chatnum desc";
		
		let data = await request.query(querystring)
		.then((result) => {
			return result.recordset;
		})
		.catch((err) => {
			throw err;
		});
		return data;
	},
	
	async chattingTotalRanking(params) {
		// Query 
		var request = new mssql.Request();
	
		if(common.gfn_isNull(params.offset)) {
			request.input('num', 0);	
		} else {
			request.input('num', 10 * (params.offset - 1));
		}
		
		var querystring = "select nickname ,count(*) as chatnum from cso_chatting with (nolock) " +
				"group by nickname order by chatnum desc offset @num rows fetch next 10 rows only";
		
		let data = await request.query(querystring)
		.then((result) => {
			return result.recordset;
		})
		.catch((err) => {
			throw err;
		});
		return data;
	},

	async calcDaily(params) {
		// Query 
		var request = new mssql.Request();
		
		let data = await request.query("exec calc_daily 1").then(() => {
			return 1;
		})
		.catch((err) => {
			throw err;
		});
		return data;
	},
	
	async uniqueUser(params) {	
		// Query 
		var request = new mssql.Request();
	
		request.input('regdate', common.gfn_stringToDate(params.date));
		var querystring = "select uniqueuser from daily with (nolock) where regdate = @regdate";
		
		let data = await request.query(querystring)
		.then((result) => {
			if(result.recordset.length > 0) {
				return result.recordset;
			} else {
				var res = [{ uniqueuser: -1 }];
				return res;
			}
		})
		.catch((err) => {
			throw err;
		});
		return data;
	},
	
	async fileRecvDataPerDay(params) {	
		// Query 
		var request = new mssql.Request();
	
		request.input('fromTime', common.gfn_stringToDate(params.date) + " 00:00:00");
		request.input('toTime', common.gfn_stringToDate(params.date) + " 23:59:59");
		var querystring = "select * from cso_filerecv with (nolock, index(idx_filerecv_1))" +
				" where regdate between @fromTime and @toTime";
		
		let data = await request.query(querystring)
		.then((result) => {
			return result.recordset;
		})
		.catch((err) => {
			throw err;
		});
		return data;
	},

	
	async fileRecvDataByNickName(params) {	
		// Query 
		var request = new mssql.Request();
	
		request.input('nickname', params.nickname);
		var querystring = "select * from cso_filerecv with (nolock, index(pk_cso_filerecv))" +
				" where nickname = @nickname";
		
		let data = await request.query(querystring)
		.then((result) => {
			return result.recordset;
		})
		.catch((err) => {
			throw err;
		});
		return data;
	}
};