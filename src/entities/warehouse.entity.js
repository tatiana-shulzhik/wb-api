const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Warehouse extends Model { }

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
