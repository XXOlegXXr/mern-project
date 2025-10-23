import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Налаштування axios з токеном
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token) {
      // GET захищений список
      api.get('/users')
        .then(res => setUsers(res.data))
        .catch(err => console.log('Помилка:', err));
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/login', loginData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setLoginData({ email: '', password: '' });
    } catch (err) {
      console.log('Логін помилка:', err.response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsers([]);
  };

  if (!token) {
    return (
      <div className="App">
        <h1>Логін</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <button type="submit">Логін</button>
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>MERN з автентифікацією</h1>
      <button onClick={logout}>Вийти</button>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
