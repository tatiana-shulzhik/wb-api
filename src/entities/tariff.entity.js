const { Model, DataTypes } = require("sequelize");

/**
 * Модель тарифа (Tariff) для работы с базой данных через Sequelize.
 * 
 * Эта модель описывает таблицу "Tariffs" в базе данных и включает поля, такие как `dtNextBox`,
 * `dtTillMax`, и `warehouseId`. Модель также определяет связь с моделью Warehouse через поле `warehouseId`.
 * 
 * @typedef {Object} Tariff
 * @property {string} id - Уникальный идентификатор тарифа (UUID).
 * @property {string} [dtNextBox] - Дата начала следующего тарифа.
 * @property {string} [dtTillMax] - Дата окончания последнего установленного тарифа.
 * @property {string} warehouseId - Идентификатор склада, с которым связан тариф (UUID).
 */
module.exports = (sequelize) => {
  class Tariff extends Model { }

  /**
   * Инициализация модели Tariff.
   * 
   * Эта функция создает модель для взаимодействия с таблицей "Tariffs" в базе данных и определяет
   * связь с моделью Warehouse через внешний ключ `warehouseId`.
   * 
   * @param {Sequelize} sequelize - Экземпляр Sequelize для подключения к базе данных.
   * @returns {Model} Модель Tariff, готовая к работе с базой данных.
   */
  Tariff.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      dtNextBox: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dtTillMax: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      warehouseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Tariff",
      tableName: "Tariffs",
      timestamps: true,
    }
  );

  /**
   * Определение связи между моделью Tariff и моделью Warehouse.
   * 
   * Каждый тариф связан с одним складом через внешний ключ `warehouseId`.
   * 
   * @type {Association} Связь "один ко многим" между Tariff и Warehouse.
   */
  Tariff.belongsTo(sequelize.models.Warehouse, {
    foreignKey: "warehouseId",
    as: "warehouse",
  });

  return Tariff;
};
