const Article = require('../controllers/article'),
      express = require('express'),
      router = express.router();

// Index
router.get('/', Article.showMainPage);

// Login