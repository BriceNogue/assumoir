const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Accès refusé. Rôles autorisés : ${roles.join(', ')}` 
            });
        }
        next();
    };
};

module.exports = { restrictTo };