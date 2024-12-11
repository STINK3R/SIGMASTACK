const mongoose = require('mongoose');

// Схема для материалов урока
const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['file', 'link', 'text'],
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

// Схема для уроков
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  materials: [materialSchema],
  order: {
    type: Number,
    default: 0
  }
});

// Схема для тем
const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  lessons: {
    type: [lessonSchema],
    default: []
  },
  order: {
    type: Number,
    default: 0
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  topics: {
    type: [topicSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Методы для работы с темами
courseSchema.methods.addTopic = async function(topicData) {
  try {
    console.log('Начало добавления темы');
    console.log('Текущие темы:', this.topics);
    console.log('Новые данные темы:', topicData);

    // Находим максимальный order среди существующих тем
    const maxOrder = this.topics.length > 0 
      ? Math.max(...this.topics.map(t => t.order))
      : -1;
    console.log('Максимальный order:', maxOrder);

    // Создаем новую тему
    const newTopic = {
      title: topicData.title,
      description: topicData.description || '',
      lessons: [],
      order: maxOrder + 1
    };
    console.log('Созданная тема:', newTopic);

    // Добавляем тему в массив
    if (!Array.isArray(this.topics)) {
      console.log('Инициализация массива тем');
      this.topics = [];
    }
    this.topics.push(newTopic);
    console.log('Темы после до��авления:', this.topics);

    // Сохраняем изменения
    console.log('Сохранение изменений');
    const savedCourse = await this.save();
    console.log('Курс сохранен:', savedCourse);

    return savedCourse;
  } catch (error) {
    console.error('Ошибка при добавлении темы:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};

// Метод для добавления урока
courseSchema.methods.addLesson = async function(topicId, lessonData) {
  try {
    const topic = this.topics.id(topicId);
    if (!topic) {
      throw new Error('Тема не найдена');
    }

    const maxOrder = topic.lessons.length > 0 
      ? Math.max(...topic.lessons.map(l => l.order))
      : -1;

    const newLesson = {
      title: lessonData.title,
      content: lessonData.content,
      materials: [],
      order: maxOrder + 1
    };

    topic.lessons.push(newLesson);
    await this.save();

    return this;
  } catch (error) {
    console.error('Ошибка при добавлении урока:', error);
    throw error;
  }
};

// Вспомогательные методы
courseSchema.methods.isTeacher = function(userId) {
  return this.teacher.toString() === userId.toString();
};

courseSchema.methods.isSubscribed = function(userId) {
  return this.students.some(studentId => studentId.toString() === userId.toString());
};

// Добавим метод для подписки
courseSchema.methods.subscribe = async function(userId) {
  if (!this.isSubscribed(userId)) {
    this.students.push(userId);
    return await this.save();
  }
  return this;
};

// Добавим метод для отписки
courseSchema.methods.unsubscribe = async function(userId) {
  if (this.isSubscribed(userId)) {
    this.students = this.students.filter(
      studentId => studentId.toString() !== userId.toString()
    );
    return await this.save();
  }
  return this;
};

// Индексы
courseSchema.index({ title: 'text', description: 'text' });

courseSchema.statics.searchCourses = async function(query) {
  try {
    console.log('Поиск курсов по запросу:', query);
    
    const courses = await this.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).populate('teacher', 'firstName lastName');

    console.log('Найдено курсов:', courses.length);
    return courses;
  } catch (error) {
    console.error('Ошибка при поиске курсов:', error);
    throw error;
  }
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 