const Lab = require('../controllers/lab.js');
const express = require('express'),
      router = express.Router();

router.get('/', Lab.renderIndex);
router.get('/cross', Lab.renderCrossPage);
router.get('/cross/getMessage', Lab.renderGetMessage);
router.get('/jsonp', Lab.handleJsonp);
router.get('/threeJs', Lab.renderThreeJsPage);

module.exports = router;