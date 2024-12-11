import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

import RegistrationPage from './RegistrationPage'
import LoginPage from './LoginPage'
import HomePage from './HomePage';
import ProfileManagement from './ProfileManagement';
import MyCourses from './MyCourses';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/profilemanagement" element={<ProfileManagement />} />
        <Route path="/mycourses" element={<MyCourses />} />
      </Routes>
    </Router>
  );
}

export default App;
