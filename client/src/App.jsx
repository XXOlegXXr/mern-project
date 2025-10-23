import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="App">
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-gray-200 transition">
            Task Manager MERN
          </Link>
          <div className="space-x-6">
            <Link to="/" className="hover:text-gray-200 transition">Головна</Link>
            <Link to="/login" className="hover:text-gray-200 transition">Логін</Link>
            <Link to="/register" className="hover:text-gray-200 transition">Реєстрація</Link>
            {token && (
              <>
                <Link to="/dashboard" className="hover:text-gray-200 transition">Dashboard</Link>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
                  Вийти
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Login setToken={setToken} />} />
      </Routes>
    </div>
  );
}

export default App;