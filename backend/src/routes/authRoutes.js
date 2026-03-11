const router = require('express').Router();
const { register, login, refresh, logout, me } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', auth, me);

module.exports = router;
