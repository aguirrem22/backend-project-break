const requireAuth = (req, res, next) => {
	if (req.cookies?.admin === 'true') {
		return next();
	}

	if (req.originalUrl.startsWith('/api/')) {
		return res.status(401).json({ message: 'No autorizado' });
	}

	return res.redirect('/login');
};

module.exports = requireAuth;
