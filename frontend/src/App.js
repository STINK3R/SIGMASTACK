import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import RegistrationPage from './RegistrationPage'
import LoginPage from './LoginPage'
import HomePage from './HomePage';
import ProfileManagement from './ProfileManagement';
import MyCourses from './MyCourses';
import CoursePage from './CoursePage';
import Layout from './Layout';
import AllCourses from './AllCourses';

// Компонент для защищенных маршрутов
const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('PrivateRoute проверка токена:', token);

      if (!token) {
        console.log('Токен не найден, перенаправление');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api/me', {
          headers: {
            'Authorization': token
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка авторизации');
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Ошибка проверки токена:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (isChecking) {
    return <div>Проверка авторизации...</div>;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route 
          path="/profilemanagement" 
          element={
            <PrivateRoute>
              <Layout>
                <ProfileManagement />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/mycourses" 
          element={
            <PrivateRoute>
              <Layout>
                <MyCourses />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/allcourses" 
          element={
            <PrivateRoute>
              <Layout>
                <AllCourses />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/course/:courseId" 
          element={
            <PrivateRoute>
              <Layout>
                <CoursePage />
              </Layout>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
