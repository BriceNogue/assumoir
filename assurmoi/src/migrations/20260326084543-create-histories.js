'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('histories', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      update_details: { 
        type: Sequelize.TEXT 
      },
      user_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'users', key: 'id' } 
      },
      request_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'requests', key: 'id' } 
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('histories');
  }
};
