const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { History } = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!req.user || !req.user.active) {
                return res.status(401).json({ message: "Utilisateur inactif ou inexistant" });
            }

            // Vérification 2FA
            if (req.user.two_step_code && !decoded.is2FAVerified) {
                return res.status(403).json({ message: "Validation 2FA requise" });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: "Non autorisé, token invalide" });
        }
    } else {
        res.status(401).json({ message: "Aucun token fourni" });
    }
};

const logAction = (actionDescription) => {
    return async (req, res, next) => {
        req.sequelizeOptions = { userId: req.user.id };
        next();
    };
};

module.exports = { protect, logAction };