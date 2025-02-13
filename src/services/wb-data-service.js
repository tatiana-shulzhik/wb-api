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
    if (!responseData) throw new Error("Некорректный ответ от API Wildberries");

    const { warehouseList, dtNextBox, dtTillMax } = responseData;
    if (!warehouseList?.length) throw new Error("Пустой список складов");

    await sequelize.transaction(async (t) => {
      const createdWarehouses = await Warehouse.bulkCreate(warehouseList, { transaction: t });

      const tariffData = createdWarehouses.map(({ id }) => ({
        dtNextBox,
        dtTillMax,
        warehouseId: id,
      }));

      await Tariff.bulkCreate(tariffData, { transaction: t });
    });

    console.log("Данные успешно обновлены");
  } catch (error) {
    console.error("Ошибка при получении данных Wildberries:", error.message);
  }
}

module.exports = { getWBDataByHour };
