var express = require('express');
var router = express.Router();
var db = require('../modules/db');

/* GET Data. */
router.get('/:permission?', function (req, res, next) {

    var query = 'SELECT 		t1.variable AS \'command\',' +
        't1.value AS \'response\',' +
        't2.value AS \'cooldown\',' +
        't3.value AS \'permission\',' +
        't4.value AS \'price\' ' +
        'FROM 		phantombot_command 	t1 ' +
        'LEFT JOIN	phantombot_cooldown	t2 ' +
        'ON			t1.variable = t2.variable ' +
        'LEFT JOIN  	phantombot_permcom    t3 ' +
        'ON			t1.variable = t3.variable ' +
        'LEFT JOIN  	phantombot_pricecom    t4 ' +
        'ON			t1.variable = t4.variable ';

    var perm = parseInt(!isNaN(req.params.permission) ? req.params.permission : 7);
    console.log('perm: ' + perm);

    if (perm >= 0) {
        query += 'WHERE t3.value = \'' + perm + '\';';
    } else {
        query += ';';
    }

    console.log('query: ' + query);

    db.queryCache(query, function (err, rows, fields) {
        if (err) {
            res.status(500).json({ error: 'server error', response: err });
        }
        else {
            console.log(rows);
            if (rows[0].length === 0) {
                res.status(404).json({ error: 'no commands found matching criteria' });
            }
            else {
                var dbJSONObj = [];

                for (var index = 0; index < rows[1].length; index++) {
                    var element = rows[1][index];
                    var jsonEl = {
                        command: {
                            name: element.command,
                            permission: element.permission,
                            cooldown: (element.cooldown === null) ? '0' : element.cooldown,
                            price: (element.price === null) ? '0' : element.price
                        }
                    };
                    dbJSONObj.push(jsonEl);
                }
                res.json({
                    description: 'list of custom commands filtered by given permission level',
                    filter: perm,
                    commandprefix: '!',
                    commandlist: dbJSONObj
                });
            }
        }
    });
});

module.exports = router;