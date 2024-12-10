import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import headWithCap from './img/head-with-cap.png';
import headWithGlasses from './img/head-with-glasses.png';
import headWithout from './img/head-without.png';
import PurpleCircle from './img/back-purple-circle.png';

// Страницы
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="logo">
            <span className="logo-edu">Edu</span>
            <span className="logo-connect">Connect</span>
          </h1>
        </header>

        {/* Main Content */}
        <main className="main">
          {/* Left Column */}
          <div className="content">
            <h2 className="title">
              Единая экосистема для студентов преподавателей и работодателей
            </h2>
            <div className="buttons">
              <button
                className="button button-primary"
                onClick={() => navigate('/login')}
              >
                Войти
              </button>
              <button
                className="button button-outline"
                onClick={() => navigate('/register')}
              >
                Регистрация
              </button>
            </div>
          </div>

          {/* Right Column - Characters */}
          <div className="characters">
            <img
              className="purpleCircle"
              src={PurpleCircle}
              alt="Character with bun"
              width={757.19}
              height={714.06}
              z={-1}
            />
            <div className="character character-1">
              <img
                src={headWithout}
                alt="Character with bun"
                width={250}
                height={200}
              />
            </div>
            <div className="character character-2">
              <img
                src={headWithGlasses}
                alt="Character with glasses"
                width={250}
                height={200}
              />
            </div>
            <div className="character character-3">
              <img
                src={headWithCap}
                alt="Character with cap"
                width={200}
                height={200}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="form-page">
      <h2>Вход</h2>
      <form>
        <label>
          Электронная почта:
          <input type="email" required />
        </label>
        <label>
          Пароль:
          <input type="password" required />
        </label>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

function RegistrationPage() {
  return (
    <div className="form-page">
      <h2>Регистрация</h2>
      <form>
        <label>
          Имя:
          <input type="text" required />
        </label>
        <label>
          Электронная почта:
          <input type="email" required />
        </label>
        <label>
          Пароль:
          <input type="password" required />
        </label>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
