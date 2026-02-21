const requireAuth = (req, res, next) => {
    req.isAdmin = req.session.isAdmin;
    next();
};

module.exports = requireAuth;