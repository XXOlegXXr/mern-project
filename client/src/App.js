import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // GET всі користувачі
    axios.get('http://localhost:5000/users')
      .then(res => setUsers(res.data))
      .catch(err => console.log('Помилка:', err));
  }, []);

  const addUser = () => {
    // POST новий користувач
    axios.post('http://localhost:5000/users', {
      name: 'New User',
      email: 'new@example.com',
      password: '123'
    }).then(res => {
      setMessage('Користувача додано!');
      setUsers([...users, res.data]);  // Оновити список
    }).catch(err => console.log('Помилка:', err));
  };

  return (
    <div className="App">
      <h1>MERN Full Stack</h1>
      <button onClick={addUser}>Додати користувача</button>
      <p>{message}</p>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
