import React, { useState } from "react";
import MyCourses from "./MyCourses"; 
import './ProfileManagement.css';

const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('personalData');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header">
        <h1 className="logo">
              <span className="logo-edu">Edu</span>
              <span className="logo-connect">Connect</span>
            </h1>
          <div className="input-search">
            <input
              type="text"
              placeholder="Искать курсы и статьи"
              
            />
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src="https://via.placeholder.com/50"
              alt="User"
              className="miniavatar"
            />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto mt-8 px-4">
        

        {/* Tabs */}
        <div className="mt-4 bord=er-b">
          <div className="Personal-data">
            <p 
              className={`cursor-pointer ${activeTab === 'personalData' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`} 
              onClick={() => setActiveTab('personalData')}
            >
              Личные данные
            </p>
            <p 
              className={`cursor-pointer ${activeTab === 'myCourses' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`} 
              onClick={() => setActiveTab('myCourses')}
            >
              Мои курсы
            </p>
          </div>
        </div>

        {/* Conditional rendering based on active tab */}
        <div className="profile-info">
          {activeTab === 'personalData' && (
            <div className="flex space-x-8">
              {/* Sidebar */}
              <div className="w-1/4 text-center">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm"></span>
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
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Имя*"
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Отчество*"
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="date"
                      placeholder="Дата рождения*"
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Должность"
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                  </div>
                  <button className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg">
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
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="email"
                      placeholder="Электронная почта*"
                      className="border rounded-lg px-4 py-2 w-full"
                    />
                  </div>
                  <button className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg">
                    Сохранить
                  </button>
                </section>

                {/* Password Section */}
                <section>
                  <h3 className="text-lg font-semibold">Пароль и авторизация</h3>
                  <div className="flex items-center gap-4 mt-4">
                    <input
                      type="password"
                      placeholder="Пароль"
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