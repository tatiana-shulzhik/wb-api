const { getGoogleSheetsService } = require("../config/google-sheets");
const { sequelize } = require("../config/config");
const Tariff = require("../entities/tariff.entity")(sequelize);
const Warehouse = require("../entities/warehouse.entity")(sequelize);

/**
 * Функция для загрузки данных в Google Sheets.
 * Загружает тарифы и связанные данные о складах в указанные таблицы Google Sheets.
 * 
 * @param {Array<string>} spreadsheetIds Массив идентификаторов таблиц Google Sheets, в которые нужно загрузить данные.
 * @throws {Error} Если передано меньше 3 таблиц для загрузки данных.
 */
async function uploadDataToGoogleSheets(spreadsheetIds) {
  try {
    if (spreadsheetIds.length < 3) {
      throw new Error("Необходимо передать минимум 3 таблицы.");
    }

    const data = await Tariff.findAll({
      include: { model: Warehouse, as: "warehouse" },
      raw: true,
    });

    const header = [
      "Название склада",
      "Коэффициент, %",
      "Доставка 1 литра, ₽",
      "Доставка каждого дополнительного литра",
      "Хранение 1 литра, ₽",
      "Хранение каждого дополнительного литра, ₽",
      "Дата начала следующего тарифа",
      "Дата окончания последнего установленного тарифа",
    ];

    const rows = data.map((row) => [
      row["warehouse.warehouseName"],
      row["warehouse.boxDeliveryAndStorageExpr"],
      row["warehouse.boxDeliveryBase"],
      row["warehouse.boxDeliveryLiter"],
      row["warehouse.boxStorageBase"],
      row["warehouse.boxStorageLiter"],
      row.dtNextBox,
      row.dtTillMax,
    ]).sort((a, b) => a[1] - b[1]);

    const service = getGoogleSheetsService();
    const sheetTitle = "stocks_coefs";
    const range = `${sheetTitle}!A:H`;

    for (const spreadsheetId of spreadsheetIds) {
      try {
        const { data: { sheets } } = await service.spreadsheets.get({ spreadsheetId });
        const sheetNames = sheets.map(sheet => sheet.properties.title);

        if (!sheetNames.includes(sheetTitle)) {
          await service.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: { requests: [{ addSheet: { properties: { title: sheetTitle } } }] },
          });
          console.log(`Лист "${sheetTitle}" создан в таблице: ${spreadsheetId}`);
        }

        await service.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: "RAW",
          requestBody: { values: [header, ...rows] },
        });

        console.log(`Данные загружены в таблицу: ${spreadsheetId}`);
      } catch (error) {
        console.error(`Ошибка при обновлении таблицы ${spreadsheetId}:`, error.message);
      }
    }
  } catch (error) {
    console.error("Ошибка при выгрузке данных в Google Таблицы:", error.message);
  }
}

module.exports = { uploadDataToGoogleSheets };
