var mysql = require('mysql');

var pool = mysql.createPool({
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_jianghel',
    password        : '3539',
    database        : 'cs340_jianghel',
    dateStrings     : 'true'
});
module.exports.pool = pool;
