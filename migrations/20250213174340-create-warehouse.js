'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Warehouses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      warehouseName: {
        type: Sequelize.STRING
      },
      boxDeliveryAndStorageExpr: {
        type: Sequelize.STRING
      },
      boxDeliveryBase: {
        type: Sequelize.STRING
      },
      boxDeliveryLiter: {
        type: Sequelize.STRING
      },
      boxStorageBase: {
        type: Sequelize.STRING
      },
      boxStorageLiter: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Warehouses');
  }
};