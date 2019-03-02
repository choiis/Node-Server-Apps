/**
 * http://usejsdoc.org/
 */
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
		if(obj.length == 0) {
			return true;
		}
	}
	return false;
};
module.exports.gfn_isNull = gfn_isNull;