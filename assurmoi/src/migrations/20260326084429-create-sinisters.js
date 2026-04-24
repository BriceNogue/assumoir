'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sinisters', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      plate: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      driver_firstname: { 
        type: Sequelize.STRING 
      },
      driver_lastname: { 
        type: Sequelize.STRING 
      },
      driver_is_insured: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: true 
      },
      call_datetime: { 
        type: Sequelize.DATE 
      },
      sinister_datetime: { 
        type: Sequelize.DATE 
      },
      context: { 
        type: Sequelize.TEXT 
      },
      driver_engaged_responsability: { 
        type: Sequelize.INTEGER 
      },
      validated: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: false 
      },
      cni_driver: { 
        type: Sequelize.INTEGER, 
        references: { model: 'documents', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'SET NULL' 
      },
      vehicule_registration_certificate: { 
        type: Sequelize.INTEGER, 
        references: { model: 'documents', key: 'id' } 
      },
      insurance_certificate: { 
        type: Sequelize.INTEGER, 
        references: { model: 'documents', key: 'id' } 
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
    await queryInterface.dropTable('sinisters');
  }
};
