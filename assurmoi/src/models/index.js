const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
require('dotenv').config();

const db = {};

const dbInstance = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mariadb',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    },
    logging: false
  }
);

// Chargement automatique.
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');
  })
  .forEach(file => {
    const modelDefiner = require(path.join(__dirname, file));
    // Chaque fichier doit exporter une fonction (dbInstance, DataTypes).
    const model = modelDefiner(dbInstance, DataTypes);
    db[model.name] = model;
  });

// Exécution des associations.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.dbInstance = dbInstance;
db.Sequelize = Sequelize;

module.exports = db;