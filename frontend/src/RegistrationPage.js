import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import headWithGlasses from './img/head-with-glasses.png';
import headWithout from './img/head-without.png';
import PurpleCircle from './img/back-purple-circle.png';

function RegistrationPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    role: ''
  });
  const [currentStep, setCurrentStep] = useState(1); // Шаг регистрации
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Проверяем при загрузке компонента, авторизован ли пользователь
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profilemanagement');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    setCurrentStep(2);
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при регистрации');
      }

      // Сохраняем токен
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Перенаправляем на страницу профиля
      navigate('/profilemanagement');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h2>Регистрация</h2>
      {error && <div className="error-message">{error}</div>}
      {currentStep === 1 && (
        <form className='form-reg'>
          <label>
            Имя:
            <input className='input-reg-log'
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Фамилия:
            <input className='input-reg-log'
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Отчество:
            <input className='input-reg-log'
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Электронная почта:
            <input className='input-reg-log'
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Пароль:
            <input className='input-reg-log'
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button className='button-auth' type="button" onClick={handleNextStep}>Далее</button>
        </form>
      )}

      {currentStep === 2 && (
        <form onSubmit={handleSubmit} className='form-reg2'>
          <fieldset className='reg-step2'>
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
      )}

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

export default RegistrationPage;