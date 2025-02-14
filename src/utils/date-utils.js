/**
 * Получение текущей даты в формате YYYY-MM-DD.
 * 
 * Эта функция создает строковое представление текущей даты в формате:
 * "Год-месяц-день" (например, "2025-02-14").
 * 
 * @returns {string} Строка с текущей датой в формате YYYY-MM-DD.
 */
function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

module.exports = { getFormattedDate };
