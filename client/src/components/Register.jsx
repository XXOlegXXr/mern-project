import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

const Register = () => {
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users', registerData);
      setMessage('Реєстрація успішна! Логіньтеся.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Помилка реєстрації');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Реєстрація</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Ім'я"
            value={registerData.name}
            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition">
            Реєстрація
          </button>
        </form>
        <p className="text-center text-red-500 mt-4">{message}</p>
        <p className="text-center mt-4">
          <Link to="/login" className="text-blue-500 hover:underline">Вже є акаунт? Логін</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
