import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import RegistrationPage from './RegistrationPage'
import LoginPage from './LoginPage'
import HomePage from './HomePage';
import ProfileManagement from './ProfileManagement';
import MyCourses from './MyCourses';
import CoursePage from './CoursePage';
import Layout from './Layout';
import AllCourses from './AllCourses';
import UserProfile from './UserProfile';
// import Portfolio from './Portfolio';

// Компонент для защищенных маршрутов
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Компонент для проверки роли и перенаправления
const AuthRedirect = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'student') {
      return <Navigate to="/mycourses" />;
    }
    return <Navigate to="/profilemanagement" />;
  }
  return <HomePage />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
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
        {/* <Route 
          path="/portfolio" 
          element={
            <PrivateRoute>
              <Layout>
                <Portfolio />
              </Layout>
            </PrivateRoute>
          } 
        /> */}
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
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Layout>
                <UserProfile />
              </Layout>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
