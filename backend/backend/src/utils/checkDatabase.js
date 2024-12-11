const mongoose = require('mongoose');
const Course = require('../models/Course');

const checkDatabase = async () => {
  try {
    // Получаем все курсы
    const courses = await Course.find().populate('teacher', 'firstName lastName');
    console.log('Всего курсов в базе:', courses.length);
    console.log('Курсы:', courses.map(c => ({
      id: c._id,
      title: c.title,
      teacher: `${c.teacher?.firstName} ${c.teacher?.lastName}`
    })));

    // Проверяем индексы
    const indexes = await Course.collection.getIndexes();
    console.log('Индексы коллекции courses:', indexes);

  } catch (error) {
    console.error('Ошибка при проверке базы данных:', error);
  }
};

module.exports = checkDatabase; 