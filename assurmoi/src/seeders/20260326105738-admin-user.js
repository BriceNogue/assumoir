'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    return queryInterface.bulkInsert('users', [{
      username: 'admin',
      email: 'admin@assurmoi.fr',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', { email: 'admin@assurmoi.fr' }, {});
  }
};

// Générer le seed : npx sequelize-cli seed:generate --name admin-user
// Exécuter le seed : npx sequelize-cli db:seed:all
