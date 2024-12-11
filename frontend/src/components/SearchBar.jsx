import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchCourses = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        console.log('Поисковый запрос:', searchQuery);

        const response = await fetch(
          `http://localhost:4000/api/courses/search?query=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Ошибка при поиске');
        }

        const data = await response.json();
        console.log('Результаты поиска:', data);
        setSearchResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Ошибка при поиске:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchCourses();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleCourseClick = (courseId) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="input-search">
        <input
          type="text"
          placeholder="Поиск курсов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
      </div>
      
      {showResults && searchQuery.trim() && (
        <div className="search-results">
          {isLoading ? (
            <div className="search-loading">Поиск...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map(course => (
              <div
                key={course._id}
                className="search-result-item"
                onClick={() => handleCourseClick(course._id)}
              >
                <h4>{course.title}</h4>
                <p>Преподаватель: {course.teacher.firstName} {course.teacher.lastName}</p>
              </div>
            ))
          ) : (
            <div className="no-results">Курсы не найдены</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 