import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

const Login = ({ setToken }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/users/login', loginData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);  // Оновлюємо токен в App
      setMessage('Логін успішний!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Серверна помилка');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Логін</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition">
            Логін
          </button>
        </form>
        <p className="text-center text-red-500 mt-4">{message}</p>
        <p className="text-center mt-4">
          <Link to="/register" className="text-blue-500 hover:underline">Немає акаунту? Реєстрація</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;