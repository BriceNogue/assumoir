const { Document, dbInstance } = require('../models');

const uploadDocument = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { type, path } = req.body; 
        const doc = await Document.create({
            type,
            path,
            validated: false
        }, { transaction });

        await transaction.commit();
        return res.status(201).json({ doc });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({ message: "Upload failed" });
    }
};

const validateDocument = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const doc = await Document.findByPk(req.params.id);
        doc.validated = true;
        await doc.save({ transaction });
        
        await transaction.commit();
        return res.status(200).json({ message: "Document validated" });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({ message: "Validation failed" });
    }
};

module.exports = { uploadDocument, validateDocument };