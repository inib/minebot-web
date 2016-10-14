var dbUser = process.env.DB_USER;
var dbHost = process.env.DB_HOST;
var dbName = process.env.DB_NAME;
var dbPass = process.env.DB_PASS;
var crypto = require('crypto');
const http = require('http');

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

var Memcache = new require('memcached');
var memCon = new Memcache(memcachedConfig);

function queryApi(url, cb) {
    var queryHash = crypto.createHash('sha512').update(url).digest("hex");
    memCon.get(queryHash, function (err, data) {
        if (err) { cb(err, null, null); }
        if (!data) {
            http.get(url, function (res) {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    var response = JSON.parse(body);
                    cb(null, response, null);
                });
            }).on('error', function (e) {
                cb(err, null, null);
            });
        }
        else {
            cb(null, data, null);
        }
    });
}

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
    },
    queryURL: function (sql, cb) {
        queryApi(sql,cb);
    }
};