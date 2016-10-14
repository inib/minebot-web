var dbUser = process.env.DB_USER;
var dbHost = process.env.DB_HOST;
var dbName = process.env.DB_NAME;
var dbPass = process.env.DB_PASS;
var crypto = require('crypto');
const http = require('https');

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
    console.log('queryApi: ' + url);
    memCon.get(queryHash, function (err, data) {
        if (err) { 
            cb(err, null, null);
            console.log('queryApi: ' + err);
        }
        if (!data) {

            http.get(url, function (res) {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    var response = JSON.parse(body);
                    console.log('queryApi: got data from https:');
                    console.log(body);
                    memCon.set(queryHash, response, 300, function(err) {
					if (err) { cb(err, null, null); }
                        cb(null, response, null);
                    });                    
                });
            }).on('error', function (e) {
                cb(err, null, null);
                console.log('queryApi: error from https: ' + err);
            });
        }
        else {
            cb(null, data, null);
            console.log('queryApi: got data from cache:');
            console.log(data);
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