const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB подключена: ${conn.connection.host}`);
    
    // Проверим имя базы данных
    console.log('Имя базы данных:', conn.connection.name);
    
    // Выведем список коллекций
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Коллекции в базе данных:', collections.map(c => c.name));
  } catch (error) {
    console.error(`Ошибка подключения к MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 