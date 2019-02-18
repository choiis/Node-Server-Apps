/**
 * http://usejsdoc.org/
 */

/** 현재 상세 시간 반환*/
var gfn_getNowTime = function() {
	var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1;
		var day = d.getDate();
		
		if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();
	
	return year + "-" + month + "-" + day + " " +hour + ":" + minute + ":" + second;
};

// 8자리 날짜를 mssql date 포맷으로
var gfn_stringToDate = function(dateString) {
	
	return dateString.substr(0, 4) + "-" + dateString.substr(4, 2) + "-" + dateString.substr(6, 2);
};

var gfn_getSecondInterval = function() {
	
	var d1 = new Date();
	var year1 = d1.getFullYear();
	var month1 = d1.getMonth() + 1;
	var day1 = d1.getDate();
	
	if(month1 < 10) {
		month1 = "0" + month1;
	}
	if(day1 < 10) {
		day1 = "0" + day1;
	}
	var hour1 = d1.getHours();
	var minute1 = d1.getMinutes();
	var second1 = d1.getSeconds();
	if(second1 < 10) {
		second1 = "0" + second1;
	}
	var d2 = new Date(d1.getTime() - 1*1000);
	var year2 = d2.getFullYear();
	var month2 = d2.getMonth() + 1;
	var day2 = d2.getDate();
	
	if(month2 < 10) {
		month2 = "0" + month2;
	}
	if(day2 < 10) {
		day2 = "0" + day2;
	}
	var hour2 = d2.getHours();
	var minute2 = d2.getMinutes();
	var second2 = d2.getSeconds();
	if(second2 < 10) {
		second2 = "0" + second2;
	}
	var times = {};
	times.toTime = year1 + "-" + month1 + "-" + day1 + " " +hour1 + ":" + minute1 + ":" + second1;
	times.fromTime = year2 + "-" + month2 + "-" + day2 + " " +hour2 + ":" + minute2 + ":" + second2;
	return times;
};

/** null 체크*/
var gfn_isNull = function(obj) {

	if(obj === undefined) {
		return true;
	} else if(obj === null) {
		return true;
	} else if(typeof obj === "string") {
		if(obj === "") {
			return true;
		}
	} else if(typeof obj === "object") {
		if(obj.length === 0) {
			return true;
		}
	}
	
	return false;
};

/** 숫자포맷 체크*/	
var gfn_isNumber = function(obj) {
	var regex= /[0-9]/;
	return regex.test(obj);
};

module.exports.gfn_getNowTime = gfn_getNowTime;
module.exports.gfn_stringToDate = gfn_stringToDate;
module.exports.gfn_getSecondInterval = gfn_getSecondInterval;
module.exports.gfn_isNull = gfn_isNull;
module.exports.gfn_isNumber = gfn_isNumber;
