const { User } = require('../models');
const { dbInstance } = require('../models');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mailLogin } = require('../utils/mailer');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Recherche de l'utilisateur.
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        if (!user.active) {
            return res.status(403).json({ message: "Ce compte a été désactivé" });
        }

        // Vérification du mot de passe.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Génération du JWT.
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role
            },
            process.env.JWT_SECRET || 'fallback_secret_pour_le_dev',
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
            }
        );

        // Envoi de l'email de notification de connexion.
        const mailStatus = await mailLogin(user);
        if (mailStatus !== true) {
            console.error('Login notification not sent');
        }

        // Réponse avec le token et les infos utilisateur.
        return res.status(200).json({
            message: "Authentification réussie",
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
    }
};

const changePassword = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id); // req.user vient du middleware protect.

        if (!(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(400).json({ message: "Ancien mot de passe incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save({ transaction });
        await transaction.commit();

        res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: "Erreur changement mdp", error: error.message });
    }
};

module.exports = { login, changePassword };