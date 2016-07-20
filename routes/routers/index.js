const Index = require("../controllers/index"),
      express = require('express'),
      router = express.Router();

// Index
router.get('/', Index.showIndexPage);

// Login
router.get('/login', Index.showLoginPage);

// Register
// router.get('/register', Index.showRegisterPage);

module.exports = router;