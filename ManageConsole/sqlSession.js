/**
 * http://usejsdoc.org/
 */
var mssql = require('mssql');

var config = {
    user: '23460',
    password: 'qw1324..',
    server: '10.10.55.62',
    port : 1433,
    database: 'server_DB'
};

// Global connection으로 만듬
mssql.connect(config);

module.exports.mssql = mssql;