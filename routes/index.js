var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: "Welcome to my home!" });
});

/* Receive the article data and save it */
router.post('/article', function(req, res) {
    
});

module.exports = router;
