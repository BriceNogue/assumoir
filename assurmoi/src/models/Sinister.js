const { sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Sinister = sequelize.define('Sinister', {
    plate: { type: DataTypes.STRING, allowNull: false },
    driver_firstname: DataTypes.STRING,
    driver_lastname: DataTypes.STRING,
    driver_is_insured: { type: DataTypes.BOOLEAN, defaultValue: true },
    call_datetime: DataTypes.DATE,
    sinister_datetime: DataTypes.DATE,
    context: DataTypes.TEXT,
    driver_engaged_responsability: { type: DataTypes.INTEGER, validate: { isIn: [[0, 50, 100]] } },
    validated: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'sinisters' });

  Sinister.associate = (models) => {
    Sinister.belongsTo(models.Document, { as: 'cni_doc', foreignKey: 'cni_driver' });
    Sinister.belongsTo(models.Document, { as: 'reg_doc', foreignKey: 'vehicule_registration_certificate' });
    Sinister.belongsTo(models.Document, { as: 'ins_doc', foreignKey: 'insurance_certificate' });
    Sinister.hasOne(models.Request, { foreignKey: 'sinister_id' });
  };
  return Sinister;
};