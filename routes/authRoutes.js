const express = require('express');
const {
	registerApi,
	loginApi,
	showLogin,
	showRegister,
	registerWeb,
	loginWeb,
	logoutWeb
} = require('../controllers/authController');

const router = express.Router();
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.get('/login', showLogin);
router.get('/register', showRegister);
router.post('/login', asyncHandler(loginWeb));
router.post('/register', asyncHandler(registerWeb));
router.post('/logout', logoutWeb);

router.post('/api/auth/register', asyncHandler(registerApi));
router.post('/api/auth/login', asyncHandler(loginApi));

module.exports = router;
