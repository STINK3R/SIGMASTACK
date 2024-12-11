import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import headWithGlasses from './img/head-with-glasses.png';
import headWithout from './img/head-without.png';

function RegistrationPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).catch(err => {
        throw new Error('Ошибка сети. Пожалуйста, проверьте подключение к серверу.');
      });

      if (!response) {
        throw new Error('Нет ответа от сервера');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при регистрации');
      }

      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Перенаправляем на главную
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error('Ошибка:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h2>Регистрация</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Имя:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Фамилия:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Отчество:
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Электронная почта:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Пароль:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <fieldset>
          <legend>Выберите вашу роль:</legend>
          <div className='iam'>Я Ученик</div>
          <label>
            <input
              type="radio"
              name="role"
              value="student"
              checked={formData.role === 'student'}
              onChange={handleChange}
            />
          </label>
          <div className='iam'>Я Преподаватель</div>
          <label>
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={formData.role === 'teacher'}
              onChange={handleChange}
            />
          </label>
          <div className='iam'>Я Наниматель</div>
          <label>
            <input
              type="radio"
              name="role"
              value="employer"
              checked={formData.role === 'employer'}
              onChange={handleChange}
            />
          </label>
        </fieldset>
        <button 
          className='button-auth' 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      
      <div className='characters1'>
        <div className="character character-11">
          <img src={headWithout} alt="Character with bun" width={250} height={200} />
        </div>
        <div className="character character-22">
          <img src={headWithGlasses} alt="Character with glasses" width={250} height={200} />
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
