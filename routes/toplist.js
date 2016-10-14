var express = require('express');
var router = express.Router();
var userName = '';

/* GET home page. */
router.get('/', function(req, res, next) {
    userName = req.params.userName;
    res.render('toplist', { title: 'Schok Toplist' });
});

module.exports = router;