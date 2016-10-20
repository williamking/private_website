const Lab = require('../controllers/lab.js');
const express = require('express'),
      router = express.Router();

router.get('/', Lab.renderIndex);
router.get('/cross', Lab.renderCrossPage);
router.get('/jsonp', Lab.handleJsonp);

module.exports = router;