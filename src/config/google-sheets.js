const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

function getGoogleSheetsService() {
  const auth = new GoogleAuth({
    keyFile: "google-file.json",
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({ version: 'v4', auth });

  return service;
}

module.exports = { getGoogleSheetsService };
