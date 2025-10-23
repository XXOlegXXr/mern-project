const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// POST реєстрація
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log('Реєстрація body:', req.body);  // Дебаг
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким email уже існує' });
    }

    // Хеш пароля вручну (якщо хук не спрацьовує)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    const newUser = await user.save();
    console.log('Користувача створено:', newUser.email);  // Дебаг
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Помилка реєстрації:', err.message);  // Дебаг
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email уже використовується' });
    }
    res.status(400).json({ message: err.message });
  }
});

// POST логін
router.post('/login', async (req, res) => {
  console.log('=== Логін дебаг ===');
  console.log('Body:', req.body);  // 1: чи приходить email/password?

  const { email, password } = req.body;
  if (!email || !password) {
    console.log('Помилка: Порожні поля');
    return res.status(400).json({ message: 'Email і пароль обов\'язкові' });
  }

  try {
    console.log('Шукаємо користувача з email:', email);
    const user = await User.findOne({ email });
    console.log('Знайдено користувача:', user ? user.email : 'НІ');  // 2: чи є користувач?

    if (!user) {
      console.log('Помилка: Користувача не знайдено');
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    console.log('Перевіряємо пароль...');
    const isMatch = await bcrypt.compare(password, user.password);  // Явний compare
    console.log('Пароль збігається:', isMatch);  // 3: чи паролі OK?

    if (!isMatch) {
      console.log('Помилка: Неправильний пароль');
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'OK' : 'НЕ ВИЗНАЧЕНО');  // 4: секрет OK?
    if (!process.env.JWT_SECRET) {
      console.log('Помилка: JWT_SECRET не налаштовано');
      return res.status(500).json({ message: 'Серверна помилка (JWT)' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Токен згенеровано');  // 5: токен OK?

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
    console.log('Логін успішний');
  } catch (err) {
    console.error('=== ПОМИЛКА ЛОГІНУ ===', err.message, err.stack);  // 6: точна помилка
    res.status(500).json({ message: 'Серверна помилка' });
  }
});

// GET всі користувачі
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET користувач за ID (з перевіркою ObjectId)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Невалідний ID' });
    }

    const user = await User.findById(req.params.id);
    if (user == null) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH оновити користувача (з перевіркою ObjectId)
router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Невалідний ID' });
    }

    const user = await User.findById(req.params.id);
    if (user == null) return res.status(404).json({ message: 'Користувача не знайдено' });

    if (req.body.name != null) user.name = req.body.name;
    if (req.body.email != null) user.email = req.body.email;
    if (req.body.password != null) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE користувача (заміна .remove() на findByIdAndDelete)
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Невалідний ID' });
    }

    const user = await User.findByIdAndDelete(req.params.id);  // Заміна .remove()
    if (user == null) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json({ message: 'Користувача видалено' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;