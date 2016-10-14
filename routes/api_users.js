var express = require('express');
var router = express.Router();
var db = require('../modules/db');

/* GET users listing. */
router.get('/:rangeStart?/:rangeEnd?', function(req, res, next) {
  var rangeS = parseInt(!isNaN(req.params.rangeStart) ? req.params.rangeStart : 0);
  var rangeE = parseInt(!isNaN(req.params.rangeEnd) ? req.params.rangeEnd : 10);
  //res.send('Start: ' + rangeS + ' End: ' + rangeE);
  var query1 = 'SET @rownum := 0;';
  var query2 = query1 + 'SELECT result.rank AS \'rank\', result.username AS \'username\', result.points AS \'points\', t1.value AS \'group\', t2.value AS \'subscribed\' '+
                        'FROM (SELECT @rownum := @rownum + 1 AS rank, variable AS username, value AS points FROM phantombot_points ORDER BY CAST(value AS SIGNED) DESC LIMIT ' + rangeS + ', ' + rangeE + ') result '+
                        'LEFT JOIN phantombot_group    t1 '+
                        'ON		result.username = t1.variable '+
                        'LEFT JOIN  	phantombot_subscribed    t2 '+
                        'ON		result.username = t2.variable;';
  
  db.queryCache(query2, function (err, rows, fields) {
    if (err) {
      res.send('error!');
    }
    else {

      var dbJSONObj = [];

      for (var index = 0; index < rows[1].length; index++) {
        var element = rows[1][index];
        var jsonEl = {
          user: {
            name: element.username,
            points: element.points,
            rank: element.rank,
            group: (element.group === null) ? '7' : element.group,
            subscribed: (element.subscribed === null) ? false : element.subscribed
          }
        };        
        dbJSONObj.push(jsonEl);
      }
      //var dbJsonString = JSON.stringify(rows[1], null, 2);
      //var dbJsonObj = JSON.parse(dbJsonString);
      res.json({rankedpointslist: dbJSONObj});
    }
  });
});

module.exports = router;