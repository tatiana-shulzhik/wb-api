const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./config/config');
const { getWBDataByHour } = require('../src/services/wb-data-service');
require('./cron-jobs/dataUpdater');

getWBDataByHour();
dotenv.config();


sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
