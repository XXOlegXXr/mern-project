const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Токен відсутній' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Користувача не знайдено' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Невірний токен' });
  }
};

module.exports = auth;