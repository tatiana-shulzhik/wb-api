const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Tariff extends Model { }

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

  return Tariff;
};
