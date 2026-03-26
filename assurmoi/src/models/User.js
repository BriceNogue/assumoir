const { sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('ADMIN', 'GESTIONNAIRE', 'CHARGE_SUIVI', 'CHARGE_CLIENTELE', 'ASSURE') },
    two_step_code: DataTypes.STRING,
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'users' });

  User.associate = (models) => {
    User.hasMany(models.History, { foreignKey: 'user_id' });
  };
  return User;
};