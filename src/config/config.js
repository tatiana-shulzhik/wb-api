const { Sequelize } = require('sequelize');
const config = require('../../config/config');

/**
 * Создание и настройка экземпляра Sequelize для подключения к базе данных.
 * 
 * Эта конфигурация используется для подключения к базе данных с использованием
 * настроек из конфигурационного файла, в частности для окружения `development`.
 * 
 * @type {Sequelize} Экземпляр Sequelize, который используется для взаимодействия с базой данных.
 */
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect,
});

module.exports = {
  sequelize,
  Sequelize,
};
