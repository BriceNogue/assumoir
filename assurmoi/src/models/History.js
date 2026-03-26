const { sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    update_details: DataTypes.TEXT,
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'histories', updatedAt: false });

  History.associate = (models) => {
    History.belongsTo(models.User, { foreignKey: 'user_id' });
    History.belongsTo(models.Request, { foreignKey: 'request_id' });
  };
  return History;
};