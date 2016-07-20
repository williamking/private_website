const Article = require('../controllers/article'),
      express = require('express'),
      router = express.Router();

// Index
router.get('/', Article.showMainPage);

// Login

module.exports = router;