'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      username: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      email: { 
        type: Sequelize.STRING, 
        unique: true, 
        allowNull: false 
      },
      password: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      role: { 
        type: Sequelize.ENUM('ADMIN', 'GESTIONNAIRE', 'CHARGE_SUIVI', 'CHARGE_CLIENTELE', 'ASSURE'), 
        defaultValue: 'ASSURE' 
      },
      two_step_code: { 
        type: Sequelize.STRING 
      },
      active: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: true 
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false 
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
