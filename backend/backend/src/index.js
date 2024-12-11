const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');
const auth = require('./middleware/auth');
const Course = require('./models/Course');
const checkDatabase = require('./utils/checkDatabase');

require('dotenv').config();

const app = express();

// Подключение к базе данных
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Маршруты
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h', algorithm: 'HS256' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршрут регистрации
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, middleName, role } = req.body;

    // Проверяем, существует ли пользователь
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создаем нового пользователя
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      middleName,
      role
    });

    // Создаем токен
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Тестовый эндпоинт
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Защищенный маршрут для проверки токена
app.get('/api/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршрут для выхода
app.post('/api/logout', auth, (req, res) => {
  res.json({ message: 'Выход выполнен успешно' });
});

// Добавьте этот маршрут к существующим
app.put('/api/user/update', auth, async (req, res) => {
  try {
    const updates = req.body;
    console.log('Получены данные для обновления:', updates);
    console.log('ID пользователя из токена:', req.user.id);

    if (!req.user.id) {
      return res.status(400).json({ message: 'ID пользователя не найден в токене' });
    }

    const user = await User.findById(req.user.id);
    console.log('Найден пользователь:', user);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновляем только разрешенные поля
    const allowedUpdates = ['firstName', 'lastName', 'middleName', 'birthDate', 'position', 'phone', 'email'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });

    try {
      const savedUser = await user.save();
      console.log('Пользователь сохранен:', savedUser);
      res.json(savedUser);
    } catch (saveError) {
      console.error('Ошибка при сохранении:', saveError);
      res.status(500).json({ 
        message: 'Ошибка при сохранении пользователя',
        error: saveError.message 
      });
    }
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка при обновлении данных',
      error: error.message 
    });
  }
});

// 1. Сначала идет маршрут поиска
app.get('/api/courses/search', auth, async (req, res) => {
  try {
    const searchQuery = req.query.query;
    console.log('Поисковый запрос:', searchQuery);

    if (!searchQuery) {
      console.log('Пустой поисковый запрос');
      return res.json([]);
    }

    // Используем метод из модели для поиска
    const courses = await Course.searchCourses(searchQuery);
    console.log('Результаты поиска:', courses);

    // Если пользователь студент, показываем все курсы
    // Если преподаватель - только его курсы
    const filteredCourses = req.user.role === 'teacher' 
      ? courses.filter(course => course.teacher._id.toString() === req.user.id)
      : courses;

    console.log('Отфильтрованные результаты:', filteredCourses);
    res.json(filteredCourses);
  } catch (error) {
    console.error('Ошибка при поиске курсов:', error);
    res.status(500).json({ 
      message: 'Ошибка при поиске курсов',
      error: error.message 
    });
  }
});

// 2. Затем маршрут получения всех курсов
app.get('/api/courses', auth, async (req, res) => {
  try {
    let courses;
    if (req.user.role === 'teacher') {
      // Для преподавателя - только его курсы
      courses = await Course.find({ teacher: req.user.id })
        .populate('teacher', 'firstName lastName')
        .populate('students', 'firstName lastName');
    } else if (req.query.type === 'subscribed') {
      // Для студента - только курсы, на которые он подписан
      courses = await Course.find({ students: req.user.id })
        .populate('teacher', 'firstName lastName')
        .populate('students', 'firstName lastName');
    } else {
      // Для студента - все доступные курсы
      courses = await Course.find()
        .populate('teacher', 'firstName lastName')
        .populate('students', 'firstName lastName');
    }
    res.json(courses);
  } catch (error) {
    console.error('Ошибка при получении курсов:', error);
    res.status(500).json({ message: 'Ошибка при получении курсов' });
  }
});

// 3. И только потом маршрут получения конкретного курса
app.get('/api/courses/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName');
    
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении информации о курсе' });
  }
});

// Создание нового курса
app.post('/api/courses', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Только преподаватели могут создавать курсы' });
    }

    console.log('Данные для создания курса:', req.body);
    console.log('ID преподавателя:', req.user.id);

    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      teacher: req.user.id,
      lectures: req.body.lectures || []
    });

    const savedCourse = await course.save();
    console.log('Созданный курс:', savedCourse);

    // Возвращаем курс с данными преподавателя
    const populatedCourse = await Course.findById(savedCourse._id)
      .populate('teacher', 'firstName lastName');

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error('Ошибка при создании курса:', error);
    res.status(500).json({ 
      message: 'Ошибка при создании курса',
      error: error.message 
    });
  }
});

// Подписка на курс (только для студентов)
app.post('/api/courses/:courseId/subscribe', auth, async (req, res) => {
  try {
    console.log('Попытка подписки на курс');
    console.log('ID курса:', req.params.courseId);
    console.log('ID пользователя:', req.user.id);

    if (req.user.role !== 'student') {
      console.log('Отказано: пользователь не студент');
      return res.status(403).json({ message: 'Только студенты могут подписываться на курсы' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      console.log('Курс не найден');
      return res.status(404).json({ message: 'Курс не найден' });
    }

    // Проверяем, подписан ли уже студент на курс
    if (course.students.includes(req.user.id)) {
      console.log('Студент уже подписан на курс');
      return res.status(400).json({ message: 'Вы уже подписаны на этот курс' });
    }

    // Добавляем студента в список
    course.students.push(req.user.id);
    await course.save();
    console.log('Студент успешно подписан на курс');

    // Возвращаем обновленный курс с данными
    const updatedCourse = await Course.findById(course._id)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');

    res.json(updatedCourse);
  } catch (error) {
    console.error('Ошибка при подписке на курс:', error);
    res.status(500).json({ 
      message: 'Ошибка при подписке на курс',
      error: error.message 
    });
  }
});

// Обновление курса (только для преподават��лей)
app.put('/api/courses/:courseId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Только преподаватели могут редактировать курсы' });
    }

    console.log('Попытка обновления курса:', req.params.courseId);
    console.log('Данные для обновления:', req.body);
    console.log('ID пользователя:', req.user.id);

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    // Проверяем, является ли пользователь создателем курса
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Вы можете редактировать только свои курсы' });
    }

    // Обновляем разрешенные поля
    const allowedUpdates = ['title', 'description'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        course[key] = req.body[key];
      }
    });

    await course.save();

    // Возвращаем обновленный курс с данными преподавателя
    const updatedCourse = await Course.findById(course._id)
      .populate('teacher', 'firstName lastName');

    res.json(updatedCourse);
  } catch (error) {
    console.error('Ошибка при обновлении курса:', error);
    res.status(500).json({ message: 'Ошибка при обновлении курса' });
  }
});

// Добавлние новой темы
app.post('/api/courses/:courseId/topics', auth, async (req, res) => {
  try {
    console.log('1. Начало обработки запроса на добавление темы');
    console.log('Данные запроса:', req.body);
    console.log('ID курса:', req.params.courseId);
    console.log('Пользователь:', req.user);

    if (req.user.role !== 'teacher') {
      console.log('Отк��зано: пользователь не преподаватель');
      return res.status(403).json({ message: 'Только преподаватели могут добавлять темы' });
    }

    console.log('2. Поиск курса');
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      console.log('Курс не найден');
      return res.status(404).json({ message: 'Курс не найден' });
    }
    console.log('Найден курс:', course);

    if (!course.isTeacher(req.user.id)) {
      console.log('Отказано: пользователь не является преподавателем курса');
      return res.status(403).json({ message: 'Вы можете редактировать только свои курсы' });
    }

    console.log('3. Добавление темы');
    const updatedCourse = await course.addTopic({
      title: req.body.title,
      description: req.body.description || ''
    });
    console.log('Тема добавлена, обновленный курс:', updatedCourse);

    console.log('4. Получение обновленного курса с populated данными');
    const populatedCourse = await Course.findById(updatedCourse._id)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');

    console.log('5. Отправка ответа');
    res.json(populatedCourse);
  } catch (error) {
    console.error('Ошибка при добавлении темы:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Ошибка при добавлении темы',
      error: error.message,
      stack: error.stack
    });
  }
});

// Добавление нового урока в тему
app.post('/api/courses/:courseId/topics/:topicId/lessons', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Только преподаватели могут добавлять уроки' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Вы можете редактировать только свои курсы' });
    }

    const updatedCourse = await course.addLesson(req.params.topicId, {
      title: req.body.title,
      content: req.body.content,
      materials: req.body.materials || []
    });

    res.json(updatedCourse);
  } catch (error) {
    console.error('Ошибка при добавлении урока:', error);
    res.status(500).json({ message: 'Ошибка при добавлении урока' });
  }
});

// Обновление темы
app.put('/api/courses/:courseId/topics/:topicId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Только преподаватели могут редактировать темы' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Вы можете редактировать только свои курсы' });
    }

    const topic = course.topics.id(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Тема не найдена' });
    }

    topic.title = req.body.title || topic.title;
    topic.description = req.body.description || topic.description;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Ошибка при обновлении темы:', error);
    res.status(500).json({ message: 'Ошибка при обновлении темы' });
  }
});

// Обновление урока
app.put('/api/courses/:courseId/topics/:topicId/lessons/:lessonId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Только преподаватели могут редактировать уроки' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Вы можете редактировать только свои курсы' });
    }

    const topic = course.topics.id(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Тема не найдена' });
    }

    const lesson = topic.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }

    lesson.title = req.body.title || lesson.title;
    lesson.content = req.body.content || lesson.content;
    lesson.materials = req.body.materials || lesson.materials;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Ошибка при обновлени�� урока:', error);
    res.status(500).json({ message: 'Ошибка при обновлении урока' });
  }
});

// Отписка от курса
app.post('/api/courses/:courseId/unsubscribe', auth, async (req, res) => {
  try {
    console.log('Попытка отписки от курса');
    console.log('ID курса:', req.params.courseId);
    console.log('ID пользователя:', req.user.id);

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Только студенты могут отписываться от курсов' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    // Проверяем, подписан ли студент на курс
    if (!course.isSubscribed(req.user.id)) {
      return res.status(400).json({ message: 'Вы не подписаны на этот курс' });
    }

    // Отписываем студента
    await course.unsubscribe(req.user.id);
    console.log('Студент успешно отписан от курса');

    // Возвращаем обновленный курс с данными
    const updatedCourse = await Course.findById(course._id)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');

    res.json(updatedCourse);
  } catch (error) {
    console.error('Ошибка при отписке от курса:', error);
    res.status(500).json({ 
      message: 'Ошибка при отписке от курса',
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  await checkDatabase();
}); 