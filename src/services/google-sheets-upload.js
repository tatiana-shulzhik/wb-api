const { getGoogleSheetsService } = require("../config/google-sheets");
const { sequelize } = require("../config/config");
const Tariff = require("../entities/tariff.entity")(sequelize);
const Warehouse = require("../entities/warehouse.entity")(sequelize);

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
    ]);

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
