const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));  // Для Vite
app.use(express.json());

// Підключення роутів
const userRouter = require('./routes/users');
app.use('/users', userRouter);
const taskRouter = require('./routes/tasks');
app.use('/tasks', taskRouter);
// З'єднання з MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/merndb';
mongoose.connect(uri)
  .then(() => console.log('MongoDB з\'єднано!'))
  .catch(err => console.log('Помилка MongoDB:', err.message));

// Тестовий роут
app.get('/', (req, res) => {
  res.send('MERN Backend працює!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
