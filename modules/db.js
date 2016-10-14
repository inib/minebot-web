var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME,
  multipleStatements: true
});

var Memento = require('memento-mysql');
var memcachedConfig = MEMCACHED_PORT;
var mysqlConfig = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME,
  multipleStatements: true
};
var memento = new Memento({
		mysql: mysqlConfig, 
		memcached: memcachedConfig
});

function queryC(sql, cb) {
    memento.query(sql, cb);
}

function queryDB(sql, cb) {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            cb(true);
        }
        else {
            connection.query(sql,cb);
            connection.release();
        }
    });
}

module.exports = {
    cache: memento,
    mysql: pool,
    queryCache: function (sql, cb) {
        queryC(sql,cb);
    },
    querySQL: function (sql, cb) {
        queryDB(sql,cb);
    }
};