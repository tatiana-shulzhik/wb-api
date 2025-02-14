const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

/**
 * Получение сервиса Google Sheets с использованием аутентификации через ключ API.
 * 
 * Эта функция создает экземпляр GoogleAuth для аутентификации с использованием файла ключа и возвращает
 * сервис для работы с Google Sheets API.
 * 
 * @returns {google.sheets_v4.Sheets} Экземпляр сервиса Google Sheets, настроенный для работы с API.
 * @throws {Error} Если возникла ошибка при аутентификации или подключении к сервису.
 */
function getGoogleSheetsService() {
  const auth = new GoogleAuth({
    keyFile: "google-file.json",
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({ version: 'v4', auth });

  return service;
}

module.exports = { getGoogleSheetsService };
