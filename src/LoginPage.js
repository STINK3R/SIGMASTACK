import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import headWithGlasses from './img/head-with-glasses.png';
import headWithout from './img/head-without.png';
import PurpleCircle from './img/back-purple-circle.png';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при входе');
      }

      // Сохраняем токен
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Перенаправляем на главную
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h2>Вход</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
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
