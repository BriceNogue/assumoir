const { sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    status: { type: DataTypes.ENUM('INITIALIZED', 'EXPERTISE_PENDING', 'REPAIR_IN_PROGRESS', 'CLOSED'), defaultValue: 'INITIALIZED' },
    diagnostic: { type: DataTypes.ENUM('REPAIRABLE', 'NOT_REPAIRABLE', 'PENDING'), defaultValue: 'PENDING' },
    expertise_plan_date: DataTypes.DATE,
    expertise_effective_date: DataTypes.DATE,
    // Scenario 1
    case1_pickup_plan_date: DataTypes.DATE,
    case1_third_party_invoice_paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    // Scenario 2
    case2_estimated_compensation: DataTypes.FLOAT,
    case2_approved_compensation: { type: DataTypes.BOOLEAN, defaultValue: false },
    closed: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'requests' });

  Request.associate = (models) => {
    Request.belongsTo(models.Sinister, { foreignKey: 'sinister_id' });
    Request.belongsTo(models.Document, { as: 'diag_report', foreignKey: 'diagnostic_report_file' });
  };

  Request.addHook('afterUpdate', async (instance, options) => {
  if (options.userId) { // On passe l'ID de l'user via le controller
    await sequelize.models.History.create({
      request_id: instance.id,
      user_id: options.userId,
      update_details: `Passage au statut : ${instance.status}`
    });
  }});

  return Request;
};