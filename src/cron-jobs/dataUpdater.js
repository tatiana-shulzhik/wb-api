const cron = require("node-cron");
const { getWBDataByHour } = require("../services/wb-data-service");

cron.schedule("0 * * * *", async () => {
    console.log("Запуск обновления данных Wildberries...");
    await getWBDataByHour();
});

console.log("Запланировано ежечасное обновление данных.");
