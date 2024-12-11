export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Удаляем HTML теги
    .replace(/'/g, "''") // Экранируем одинарные кавычки
    .replace(/\\/g, '\\\\') // Экранируем обратные слэши
    .replace(/"/g, '\\"') // Экранируем двойные кавычки
    .replace(/;/g, '') // Удаляем точки с запятой (защита от SQL-инъекций)
    .replace(/--/g, '') // Удаляем SQL комментарии
    .replace(/\/\*/g, '') // Удаляем начало многострочного комментария
    .replace(/\*\//g, '') // Удаляем конец многострочного комментария
    .replace(/union/gi, '') // Удаляем UNION
    .replace(/select/gi, '') // Удаляем SELECT
    .replace(/drop/gi, '') // Удаляем DROP
    .replace(/delete/gi, '') // Удаляем DELETE
    .replace(/update/gi, '') // Удаляем UPDATE
    .replace(/insert/gi, '') // Удаляем INSERT
    .trim(); // Удаляем пробелы в начале и конце
};