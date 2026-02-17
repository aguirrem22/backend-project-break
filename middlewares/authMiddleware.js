const jwt = require('jsonwebtoken');

function getTokenFromRequest(req) {
	const authHeader = req.headers.authorization || '';
	if (authHeader.startsWith('Bearer ')) {
		return authHeader.replace('Bearer ', '').trim();
	}

	if (req.cookies?.token) {
		return req.cookies.token;
	}

	return null;
}

function verifyToken(token) {
	const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
	return jwt.verify(token, secret);
}

function requireAuthApi(req, res, next) {
	const token = getTokenFromRequest(req);

	if (!token) {
		return res.status(401).json({ message: 'No autorizado: falta token' });
	}

	try {
		req.user = verifyToken(token);
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Token inválido o expirado' });
	}
}

function requireAuthDashboard(req, res, next) {
	const token = getTokenFromRequest(req);

	if (!token) {
		return res.redirect('/login');
	}

	try {
		req.user = verifyToken(token);
		next();
	} catch (error) {
		return res.redirect('/login');
	}
}

module.exports = {
	requireAuthApi,
	requireAuthDashboard
};
