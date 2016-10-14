var express = require('express');
var router = express.Router();
var db = require('../modules/db');
var twitchNameExp = new RegExp('^[a-zA-Z0-9][\\w]{2,24}$');

 var query1 =   'SET @rownum := 0;';
 var query2 =   'SELECT 		t1.variable AS \'username\','+ 
			                    't2.value AS \'brawlwins\','+
                                't3.value AS \'usergroup\','+
                                't4.value AS \'lastseen\','+
                                't5.value AS \'time\','+
                                't6.value AS \'subscriber\','+
                                't7.value AS \'customrank\', '+
                                't8.value AS \'points\', '+
                                'result.rank AS \'rank\' '+
                'FROM 		phantombot_visited 	t1 '+
                'LEFT JOIN	phantombot_brawl	t2 '+
                'ON			t1.variable = t2.variable '+
                'LEFT JOIN  	phantombot_group    t3 '+
                'ON			t1.variable = t3.variable '+
                'LEFT JOIN  	phantombot_lastseen    t4 '+
                'ON			t1.variable = t4.variable '+
                'LEFT JOIN  	phantombot_time    t5 '+
                'ON			t1.variable = t5.variable '+
                'LEFT JOIN  	phantombot_subscribed    t6 '+
                'ON			t1.variable = t6.variable '+
                'LEFT JOIN  	phantombot_viewerRanks    t7 '+
                'ON			t1.variable = t7.variable '+
                'LEFT JOIN  	phantombot_points    t8 '+
                'ON			t1.variable = t8.variable '+
                'LEFT JOIN 	(SELECT @rownum := @rownum + 1 AS rank, variable AS username, value AS points FROM phantombot_points ORDER BY CAST(value AS SIGNED) DESC ) result '+
                'ON			t1.variable = result.username '+
                'WHERE		t1.variable = "$name";';

 /* GET users listing. */
 router.get('/:userName', function (req, res, next) {
     if (!req.params.userName || !twitchNameExp.test(req.params.userName)) {
         res.status(400).json({ error: 'invalid or missing username'});
     }
     else {
         var userName = req.params.userName.toLowerCase();
         var q = query1 + query2.replace('$name', userName);
         db.queryCache(q, function (err, rows, fields) {
             if (err) {
                 res.status(500).json({ error: 'server error', response: err });
             }
             else {
                 if (rows[1].length === 0) {
                     res.status(404).json({ error: 'username not found' });
                 }
                 else {
                     var dbJSONObj = [];
                     var element = rows[1][0];
                     var jsonEl = {
                         user: {
                             name: element.username,
                             points: element.points,
                             rank: element.rank,
                             group: (element.usergroup === null) ? '7' : element.usergroup,
                             subscribed: (element.subscriber === null) ? false : element.subscriber,
                             time: element.time,
                             lastseen: element.lastseen,
                             brawlwins: (element.brawlwins === null) ? '0' : element.brawlwins,
                             customrank: (element.customrank === null) ? 'keinen' : element.customrank
                         }
                     };
                     dbJSONObj.push(jsonEl);
                     res.json({userdetails: dbJSONObj});
                 }
             }
         });
     }
 });

module.exports = router;