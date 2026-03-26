const { Request, dbInstance, History } = require('../models');

const getRequest = async (req, res) => {
    const request = await Request.findOne({
        where: { id: req.params.id },
        include: ['Sinister', 'diag_report']
    });
    res.status(200).json({ request });
};

const updateRequestStatus = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const request = await Request.findByPk(req.params.id);
        if (!request) throw new Error("Not found");

        await request.update(req.body, { transaction });

        await History.create({
            request_id: request.id,
            user_id: req.user?.id, 
            update_details: `Status changed to ${req.body.status || request.status}`
        }, { transaction });

        await transaction.commit();
        return res.status(200).json({ message: "Request updated", request });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({ message: "Update failed", error: error.message });
    }
};

module.exports = { getRequest, updateRequestStatus };