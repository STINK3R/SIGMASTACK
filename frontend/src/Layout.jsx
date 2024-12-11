import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem('user'))?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-edu">Edu</span>
            <span className="logo-connect">Connect</span>
          </h1>
          <SearchBar />
        </div>
        <nav className="nav-menu">
          <Link 
            to="/profilemanagement" 
            className={location.pathname === '/profilemanagement' ? 'active' : ''}
          >
            Личные данные
          </Link>
          <Link 
            to="/mycourses" 
            className={location.pathname === '/mycourses' ? 'active' : ''}
          >
            {userRole === 'teacher' ? 'Мои курсы' : 'Подписки'}
          </Link>
          {userRole === 'student' && (
            <Link 
              to="/allcourses" 
              className={location.pathname === '/allcourses' ? 'active' : ''}
            >
              Все курсы
            </Link>
          )}
        </nav>
        <div className="header-right">
          <img 
            src="https://via.placeholder.com/40"
            alt="User"
            className="user-avatar"
          />
          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 