const cron = require("node-cron");
const { getWBDataByHour } = require("../services/wb-data-service");

/**
 * Запланированная задача с использованием cron, которая запускает обновление данных Wildberries каждый час.
 * 
 * Эта задача будет выполняться каждый час (в 0 минут) и вызывать функцию для получения и обновления данных
 * из API Wildberries. После выполнения функции данные обновляются в базе данных и выгружаются в Google Sheets.
 * 
 * @async
 * @returns {Promise<void>} Возвращает промис, который завершится после выполнения задачи обновления данных.
 */
cron.schedule("0 * * * *", async () => {
    console.log("Запуск обновления данных Wildberries...");
    await getWBDataByHour();
});

console.log("Запланировано ежечасное обновление данных.");
