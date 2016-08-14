const Index = require("../controllers/index"),
      express = require('express'),
      router = express.Router();

// Index
router.get('/', Index.showIndexPage);

// Register
// router.get('/register', Index.showRegisterPage);

module.exports = router;