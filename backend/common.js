/**
 * http://usejsdoc.org/
 */
module.exports = {
	/** 현재 상세 시간 반환*/
	gfn_getNowTime() {
		let d = new Date();
		let year = d.getFullYear();
		let month = d.getMonth() + 1;
		let day = d.getDate();
		
		if (month < 10) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day;
		}
		let hour = d.getHours();
		let minute = d.getMinutes();
		let second = d.getSeconds();
	
		return year + "-" + month + "-" + day + " " +hour + ":" + minute + ":" + second;
	},

	// 8자리 날짜를 mssql date 포맷으로
	gfn_stringToDate(dateString) {

		return dateString.substr(0, 4) + "-" + dateString.substr(4, 2) + "-" + dateString.substr(6, 2);
	},

	gfn_getSecondInterval() {
	
		let d1 = new Date();
		let year1 = d1.getFullYear();
		let month1 = d1.getMonth() + 1;
		let day1 = d1.getDate();
	
		if (month1 < 10) {
			month1 = "0" + month1;
		}
		if (day1 < 10) {
			day1 = "0" + day1;
		}
		let hour1 = d1.getHours();
		let minute1 = d1.getMinutes();
		let second1 = d1.getSeconds();
		if (second1 < 10) {
			second1 = "0" + second1;
		}
		let d2 = new Date(d1.getTime() - 1*1000);
		let year2 = d2.getFullYear();
		let month2 = d2.getMonth() + 1;
		let day2 = d2.getDate();
	
		if (month2 < 10) {
			month2 = "0" + month2;
		}
		if (day2 < 10) {
			day2 = "0" + day2;
		}
		let hour2 = d2.getHours();
		let minute2 = d2.getMinutes();
		let second2 = d2.getSeconds();
		if (second2 < 10) {
			second2 = "0" + second2;
		}
		let times = {};
		times.toTime = year1 + "-" + month1 + "-" + day1 + " " +hour1 + ":" + minute1 + ":" + second1;
		times.fromTime = year2 + "-" + month2 + "-" + day2 + " " +hour2 + ":" + minute2 + ":" + second2;
		return times;
	},

	/** null 체크*/
	gfn_isNull(obj) {

		if (obj === undefined) {
			return true;
		} else if (obj === null) {
			return true;
		} else if (typeof obj === "string") {
			if (obj === "") {
				return true;
			}
		} else if (typeof obj === "object") {
			if (obj.length === 0) {
				return true;
			}
		}
	
		return false;
	},

	/** 숫자포맷 체크*/	
 	gfn_isNumber(obj) {
		let regex= /[0-9]/;
		return regex.test(obj);
	},

	XSSFilter(content) {
		return content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	},

}

// C++ Server가 받아줄 상수
const CALLCOUNT = 20;
const BAN = 21;
const EXIT = 22;

// 상수 정의
module.exports.CALLCOUNT = CALLCOUNT;
module.exports.BAN = BAN;
module.exports.EXIT = EXIT;
