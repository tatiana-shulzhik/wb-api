'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Warehouse.init({
    id: DataTypes.UUID,
    warehouseName: DataTypes.STRING,
    boxDeliveryAndStorageExpr: DataTypes.STRING,
    boxDeliveryBase: DataTypes.STRING,
    boxDeliveryLiter: DataTypes.STRING,
    boxStorageBase: DataTypes.STRING,
    boxStorageLiter: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Warehouse',
  });
  return Warehouse;
};