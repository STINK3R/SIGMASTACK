import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import headWithGlasses from './img/head-with-glasses.png';
import headWithout from './img/head-without.png';
import PurpleCircle from './img/back-purple-circle.png';
import { sanitizeInput } from './utils/sanitize';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/allcourses');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const sanitizedData = {
        email: sanitizeInput(email),
        password: sanitizeInput(password)
      };

      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при входе');
      }

      // Добавим логирование
      console.log('Получен ответ:', data);

      if (!data.token) {
        throw new Error('Токен не получен от сервера');
      }

      // Сохраняем токен
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Проверим сохранение
      const savedToken = localStorage.getItem('token');
      console.log('Сохраненный токен:', savedToken);

      if (savedToken) {
        // Перенаправляем на страницу профиля
        navigate('/profile');
      } else {
        throw new Error('Ошибка при сохранении токена');
      }
    } catch (err) {
      console.error('Ошибка при входе:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h2>Вход</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className='form-log'>
        <label>
          Электронная почта:
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </label>
        <label>
          Пароль:
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </label>
        <div className='send-selection'>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
        </div>
      </form>
      <div className='characters1'>
        <div className="character character-11">
          <img src={headWithout} alt="Character with bun" width={250} height={200} />
        </div>
        <div className="character character-22">
          <img src={headWithGlasses} alt="Character with glasses" width={250} height={200} />
        </div>
      </div>
      <img
                className="purpleCircle-reglog"
                src={PurpleCircle}
                alt="Character with bun"
                width={757.19}
                height={714.06}
                
              />
    </div>
  );
}

export default LoginPage;
