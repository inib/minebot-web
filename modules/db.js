var dbUser = process.env.DB_USER;
var dbHost = process.env.DB_HOST;
var dbName = process.env.DB_NAME;
var dbPass = process.env.DB_PASS;

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: dbHost,
  user: dbUser,
  password: dbPass,
  database: dbName,
  multipleStatements: true
});

var Memento = require('memento-mysql');
var memcachedConfig = process.env.MEMCACHED_ADDR;
var mysqlConfig = {
  host: dbHost,
  user: dbUser,
  password: dbPass,
  database: dbName,
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