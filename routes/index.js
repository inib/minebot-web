var express = require('express');
var router = express.Router();
var userName = '';

/* GET home page. */
router.get('/', function(req, res, next) {
    userName = req.params.userName;
    res.render('index', { title: 'Minebot' });
});

module.exports = router;
