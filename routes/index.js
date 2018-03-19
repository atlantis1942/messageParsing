var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('messageParsing.html', { title: 'messageParsing' });
  //res.sendfile(__dirname, 'messageParsing.html')
});

module.exports = router;
