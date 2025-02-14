const { Model, DataTypes } = require("sequelize");

/**
 * Модель склада (Warehouse) для работы с базой данных через Sequelize.
 * 
 * Эта модель описывает таблицу "Warehouses" в базе данных и включает различные поля,
 * такие как `warehouseName`, `boxDeliveryAndStorageExpr`, `boxDeliveryBase`, и другие.
 * 
 * @typedef {Object} Warehouse
 * @property {string} id - Уникальный идентификатор склада (UUID).
 * @property {string} warehouseName - Название склада.
 * @property {string} [boxDeliveryAndStorageExpr] - Дополнительное описание для доставки и хранения коробов.
 * @property {string} [boxDeliveryBase] - Базовая стоимость доставки коробов.
 * @property {string} [boxDeliveryLiter] - Стоимость доставки за литр.
 * @property {string} [boxStorageBase] - Базовая стоимость хранения коробов.
 * @property {string} [boxStorageLiter] - Стоимость хранения за литр.
 */
module.exports = (sequelize) => {
  class Warehouse extends Model { }

  /**
   * Инициализация модели Warehouse.
   * 
   * Эта функция создает модель для взаимодействия с таблицей "Warehouses" в базе данных.
   * 
   * @param {Sequelize} sequelize - Экземпляр Sequelize для подключения к базе данных.
   * @returns {Model} Модель Warehouse, готовая к работе с базой данных.
   */
  Warehouse.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      warehouseName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      boxDeliveryAndStorageExpr: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      boxDeliveryBase: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      boxDeliveryLiter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      boxStorageBase: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      boxStorageLiter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Warehouse",
      tableName: "Warehouses",
      timestamps: true,
    }
  );

  return Warehouse;
};
