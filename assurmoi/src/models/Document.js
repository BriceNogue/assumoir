const { sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    type: DataTypes.STRING,
    path: { type: DataTypes.TEXT, allowNull: false },
    validated: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'documents' });
  return Document;
};