const { getFormattedDate } = require("../utils/date-utils");
const axios = require("axios");
const { sequelize } = require("../config/config");
const Warehouse = require("../entities/warehouse.entity")(sequelize);
const Tariff = require("../entities/tariff.entity")(sequelize);
const { uploadDataToGoogleSheets } = require("./google-sheets-upload");

/**
 * Получение данных по тарифам с API Wildberries и обновление базы данных.
 * Загружает информацию о складах и тарифах в базу данных, а затем выгружает данные в Google Sheets.
 * 
 * @async
 * @throws {Error} Если возникает ошибка при получении токена или данных из API Wildberries, или если ответ от API некорректен.
 * @throws {Error} Если API Wildberries возвращает пустой или некорректный список складов.
 * @returns {Promise<void>} Возвращает промис, который завершится, когда данные будут успешно обновлены и выгружены в Google Sheets.
 */
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

        const existingTariff = await Tariff.findOne({
          where: { warehouseId: currentWarehouse.id },
          transaction,
        });

        if (existingTariff) {
          await existingTariff.update({ dtNextBox, dtTillMax, createdAt: formattedDate }, { transaction });
        } else {
          await Tariff.create(
            { warehouseId: currentWarehouse.id, dtNextBox, dtTillMax, createdAt: formattedDate },
            { transaction }
          );
        }
      }
    });
    console.log("Данные успешно обновлены");

    const spreadsheetIds = process.env.SPREADSHEET_IDS.split(",");;
    await uploadDataToGoogleSheets(spreadsheetIds);
  } catch (error) {
    console.error("Ошибка при получении данных Wildberries:", error.message);
  }
}

module.exports = { getWBDataByHour };
