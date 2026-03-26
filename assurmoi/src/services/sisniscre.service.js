const { Op } = require('sequelize');
const { Sinister, Request, dbInstance } = require('../models');

const getAllSinisters = async (req, res) => {
    let queryParam = {};
    if(req.query?.search) {
        queryParam = {
            where: {
                plate: { [Op.like]: `%${req.query.search}%` }
            }
        };
    }
    const sinisters = await Sinister.findAll(queryParam);
    res.status(200).json({ sinisters });
}

const createSinister = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const sinister = await Sinister.create(req.body, { transaction });
        
        // Création automatique du dossier Request lié au sinistre.
        await Request.create({
            sinister_id: sinister.id,
            status: 'INITIALIZED'
        }, { transaction });

        await transaction.commit();
        return res.status(201).json({ sinister });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({ message: "Error on sinister creation", error });
    }
}

const updateSinister = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const sinister = await Sinister.findByPk(req.params.id);
        if (!sinister) return res.status(404).json({ message: "Sinister not found" });

        await sinister.update(req.body, { transaction });
        await transaction.commit();
        return res.status(200).json({ sinister });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({ message: "Error on update" });
    }
}

module.exports = { getAllSinisters, createSinister, updateSinister };