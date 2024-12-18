import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import MyCourses from "./MyCourses"; 
import './ProfileManagement.css';
import { sanitizeInput } from './utils/sanitize';
import './UserProfile'


const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('personalData');
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    position: '',
    phone: '',
    email: ''
  });
  const navigate = useNavigate();


  const [portfolioImage, setPortfolioImage] = useState('defaultPortfolioImage'); // Дефолтное изображение
  const handlePortfolioImageChange = (event) => {
    const file = event.target.files[0];
    console.log('Файл выбран:', file); // Для проверки
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('Файл загружен:', e.target.result); // Для проверки
            setPortfolioImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
};

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('Проверка токена:', token);

      if (!token) {
        console.log('Токен не найден, перенаправление на /login');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Ответ от сервера:', response.status);

        if (!response.ok) {
          throw new Error('Ошибка авторизации');
        }

        const data = await response.json();
        console.log('Данные пользователя:', data);
        setUserData(data);
        
        // Заполняем форму д��нными пользователя
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          middleName: data.middleName || '',
          birthDate: data.birthDate || '',
          position: data.position || '',
          phone: data.phone || '',
          email: data.email || ''
        });
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: sanitizeInput(value)
    }));
  };

  const handleSavePersonal = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Отправляем данные:', formData);
      console.log('Токен:', token);

      const response = await fetch('http://localhost:4000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Ответ сервера:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении данных');
      }

      setUserData(data);
      alert('Данные успешно сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert(error.message || 'Ошибка при сохранении данных');
    }
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Main Content */}
      <main className="container mx-auto mt-8 px-4">


        {/* Conditional rendering based on active tab */}
        <div className="profile-info">
          {activeTab === 'personalData' && (
            <div className="space-x-8">
              {/* Sidebar */}
              <div className="w-1/4 text-center display-none">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
       
                </div>
                <p className="text-gray-500 mt-4"></p>
              </div>

              {/* Main Form */}
            <div className="input-about">
              <div className="flex-1">
                {/* Personal Info */}
                <section className="mb-8">
                  <h3 className="text-lg font-semibold">Личные данные</h3>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <input
                      type="text"
                      placeholder="Фамилия*"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Имя*"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Отчество*"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="date"
                      placeholder="Дата рождения*"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Должность"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                  </div>
                  <button className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg" onClick={handleSavePersonal}>
                    Сохранить
                  </button>
                </section>

                {/* Contact Info */}
                <section className="mb-8">
                  <h3 className="text-lg font-semibold">Контактная информация</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                      type="text"
                      placeholder="Контактный телефон*"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="email"
                      placeholder="Электронная почта*"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                  </div>
                  <button className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg" onClick={handleSavePersonal}>
                    Сохранить
                  </button>
                </section>

                <section className="mb-8">
                <h3 className="text-lg font-semibold">Сменить показываемое фото на Портфолио</h3>


                  <input className="input-image"
                    type="file" 
                    multiple 
                    accept="image/*"
                    id="file-input"
                    onChange={handlePortfolioImageChange} 
                  />
       
                     <button className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg" onClick={handleSavePersonal}>
                    Сохранить
                  </button>
                  </section>
                {/* Password Section */}
                <section>
                  <h3 className="text-lg font-semibold">Пароль и авторизация</h3>
                  <div className="flex flex-direction-column">
                    <input
                      type="password"
                      placeholder="Введите старый пароль"
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                     <input
                      type="password"
                      placeholder="Введите новый пароль"
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                     <input
                      type="password"
                      placeholder="Повторите новый пароль"
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                  </div>
                  <button className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg last-button">
                    Сохранить
                  </button>
                </section>
              </div>
            </div>
            </div>
          )}
          {activeTab === 'myCourses' && <MyCourses />}
        </div>
      </main>
    </div>
  );
};

export default ProfileManagement;