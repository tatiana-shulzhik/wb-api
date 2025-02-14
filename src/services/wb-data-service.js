const { getFormattedDate } = require("../utils/date-utils");
const axios = require("axios");
const { sequelize } = require("../config/config");
const Warehouse = require("../entities/warehouse.entity")(sequelize);
const Tariff = require("../entities/tariff.entity")(sequelize);

async function getWBDataByHour() {
  try {
    const token = process.env.WB_API_TOKEN;
    if (!token) throw new Error("WB_API_TOKEN не найден в .env");

    const formattedDate = getFormattedDate();
    const { data } = await axios.get(
      `https://common-api.wildberries.ru/api/v1/tariffs/box?date=${formattedDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const responseData = data?.response?.data;

    if (!responseData || !responseData.warehouseList?.length) {
      throw new Error("Некорректный ответ от API Wildberries или пустой warehouseList");
    }

    const { warehouseList, dtNextBox, dtTillMax } = responseData;

    await sequelize.transaction(async (transaction) => {
      for (const warehouse of warehouseList) {
        if (!warehouse.warehouseName) {
          console.warn("Warning: warehouseName is missing for warehouse:", warehouse);
          continue;
        }

        const [currentWarehouse] = await Warehouse.findOrCreate({
          where: { warehouseName: warehouse.warehouseName, createdAt: `${formattedDate} 00:00:00+00` },
          defaults: { ...warehouse, createdAt: formattedDate },
          transaction,
        });

        await Tariff.upsert(
          { warehouseId: currentWarehouse.id, dtNextBox, dtTillMax, createdAt: formattedDate },
          { transaction }
        );
      }
    });
    console.log("Данные успешно обновлены");
  } catch (error) {
    console.error("Ошибка при получении данных Wildberries:", error.message);
  }
}

module.exports = { getWBDataByHour };
