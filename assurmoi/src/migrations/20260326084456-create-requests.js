'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('requests', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      sinister_id: { 
        type: Sequelize.INTEGER, 
        references: { model: 'sinisters', key: 'id' }, 
        onDelete: 'CASCADE' 
      },
      status: { 
        type: Sequelize.ENUM('INITIALIZED', 'EXPERTISE_PENDING', 'REPAIR_IN_PROGRESS', 'CLOSED'), 
        defaultValue: 'INITIALIZED' 
      },
      diagnostic: { 
        type: Sequelize.ENUM('PENDING', 'REPAIRABLE', 'NOT_REPAIRABLE'), 
        defaultValue: 'PENDING' 
      },

      // Champs scénarios
      case1_pickup_plan_date: { 
        type: Sequelize.DATE 
      },
      case2_estimated_compensation: { 
        type: Sequelize.FLOAT 
      },
      case2_approved_compensation: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false 
      },
      closed: { 
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
    await queryInterface.dropTable('requests');
  }
};
