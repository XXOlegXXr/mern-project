import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Помилка завантаження завдань:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);  // Залежності OK, без loadTasks (ESLint не скаржиться)

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', newTask);
      setTasks([...tasks, res.data]);
      setNewTask({ title: '', description: '' });
      setMessage('Завдання додано!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Помилка додавання: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      setMessage('Завдання видалено!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Помилка видалення: ' + (err.response?.data?.message || err.message));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Мої завдання</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Вийти
          </button>
        </div>
        <form onSubmit={handleAddTask} className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Додати завдання</h2>
          <input
            type="text"
            placeholder="Заголовок"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Опис"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Додати
          </button>
        </form>
        <p className="text-green-500 mb-4">{message}</p>
        <div className="grid gap-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500">Немає завдань. Додайте перше!</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</p>
                <button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-600">
                  Видалити
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;