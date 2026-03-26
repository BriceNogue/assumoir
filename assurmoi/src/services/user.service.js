const { Op } = require('sequelize');
const { User, dbInstance } = require('../models');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        let queryParam = {
            attributes: { exclude: ['password'] }
        };

        if (req.query?.search) {
            queryParam.where = {
                [Op.or]: [
                    { 
                        username: { 
                            [Op.like]: `%${req.query.search}%` 
                        } 
                    },
                    { 
                        email: { 
                            [Op.like]: `%${req.query.search}%` 
                        } 
                    }
                ]
            };
        }

        const users = await User.findAll(queryParam);
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération des utilisateurs.", 
            error: error.message 
        });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { 
                exclude: ['password'] 
            }
        });

        if (!user) return res.status(404).json({ 
            message: "Utilisateur non trouvé." });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération de l'utilisateur.", 
            error: error.message 
        });
    }
}

const createUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { 
            username, 
            email, 
            password, 
            role 
        } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'ASSURE',
            active: true
        }, { transaction });
        
        await transaction.commit();

        const userResponse = user.toJSON();
        delete userResponse.password;

        return res.status(201).json({ user: userResponse });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            message: "Error on user creation",
            stacktrace: error.errors || error.message
        });
    }
}

const updateUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { 
            username, 
            email,
            role, 
            active 
        } = req.body;

        const user_id = req.params.id;

        const user = await User.findByPk(user_id, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        // Mise à jour des champs
        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;
        user.active = active !== undefined ? active : user.active;

        await user.save({ transaction });

        await transaction.commit();
        
        const userResponse = user.toJSON();
        delete userResponse.password;

        return res.status(200).json({
            message: "Successfully updated",
            user: userResponse
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            message: "Error on user update",
            stacktrace: error.errors || error.message
        });
    }
}

const deleteUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id },
            transaction
        });

        if (!deleted) {
            await transaction.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        await transaction.commit();
        return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            message: "Error on user deletion",
            stacktrace: error.errors || error.message
        });
    }
}

const userService = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};

module.exports = userService;
