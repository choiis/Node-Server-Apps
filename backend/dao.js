/**
 * http://usejsdoc.org/
 */
const sqlSession = require('./sqlSession');
const common = require('./common');
const mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper([ './sql/mapper.xml' ]);

const mssql = sqlSession.mssql;

const format = {language: 'sql', indent: '  '};

module.exports = {
	
	async selectId(params) {
		
		let request = new mssql.Request();

		let querystring = mybatisMapper.getStatement('SQLMapper', 'selectId', params, format);
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
		
		let request = new mssql.Request();
		let param = {
			fromTime : common.gfn_stringToDate(params.date) + " 00:00:00",
			toTime : common.gfn_stringToDate(params.date) + " 23:59:59"
		};
		
		let querystring = mybatisMapper.getStatement('SQLMapper', 'directionCountPerDay', param, format);
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
		
		let request = new mssql.Request();
		let param = {
			fromTime : common.gfn_stringToDate(params.date) + " 00:00:00",
			toTime : common.gfn_stringToDate(params.date) + " 23:59:59"
		};

		let querystring = mybatisMapper.getStatement('SQLMapper', 'chattingCountPerDay', param, format);
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
		let request = new mssql.Request();
		let param = {
			fromTime : common.gfn_stringToDate(params.date) + " 00:00:00",
			toTime : common.gfn_stringToDate(params.date) + " 23:59:59"
		};
		
		let querystring = mybatisMapper.getStatement('SQLMapper', 'chattingStatistics', param, format);
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
		
		let request = new mssql.Request();
		let param = {
			fromTime : common.gfn_stringToDate(params.date) + " 00:00:00",
			toTime : common.gfn_stringToDate(params.date) + " 23:59:59"
		};

		let querystring = mybatisMapper.getStatement('SQLMapper', 'chattingRanking', param, format);
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
		
		let request = new mssql.Request();
		let param = {
			num : 0
		};

		if(common.gfn_isNull(params.offset)) {
			param.num = 0;	
		} else {
			param.num =  10 * (params.offset - 1);
		}
		
		let querystring = mybatisMapper.getStatement('SQLMapper', 'chattingTotalRanking', param, format);
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
		let request = new mssql.Request();

		let querystring = mybatisMapper.getStatement('SQLMapper', 'calcDaily', params, format);
		let data = await request.query(querystring)
		.then(() => {
			return 1;
		})
		.catch((err) => {
			throw err;
		});
		return data;
	},
	
	async uniqueUser(params) {	
		
		let request = new mssql.Request();
		let param = {
			regdate : common.gfn_stringToDate(params.date)
		};

		let querystring = mybatisMapper.getStatement('SQLMapper', 'uniqueUser', param, format);
		let data = await request.query(querystring)
		.then((result) => {
			if(result.recordset.length > 0) {
				return result.recordset;
			} else {
				let res = [{ uniqueuser: -1 }];
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
		let request = new mssql.Request();
		let param = {
			fromTime : common.gfn_stringToDate(params.date) + " 00:00:00",
			toTime : common.gfn_stringToDate(params.date) + " 23:59:59"
		};

		let querystring = mybatisMapper.getStatement('SQLMapper', 'fileRecvDataPerDay', param, format);
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
		let request = new mssql.Request();
		
		let querystring = mybatisMapper.getStatement('SQLMapper', 'fileRecvDataByNickName', params, format);
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