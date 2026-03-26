'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      type: { 
        type: Sequelize.ENUM('CNI', 'CARTE_GRISE', 'ATTESTATION', 'FACTURE', 'RIB', 'RAPPORT_EXPERT'), 
        allowNull: false 
      },
      path: { 
        type: Sequelize.TEXT, 
        allowNull: false 
      },
      validated: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false 
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
    await queryInterface.dropTable('documents');
  }
};
