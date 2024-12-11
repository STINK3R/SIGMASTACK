const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    console.log('Полученный токен:', token);

    if (token && token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '');
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Ошибка верификации токена:', error);
      return res.status(401).json({ message: 'Недействительный токен' });
    }
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return res.status(500).json({ message: 'Ошибка сервера при аутентификации' });
  }
};

module.exports = auth; 