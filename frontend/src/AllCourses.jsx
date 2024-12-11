import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllCourses.css';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    setUserRole(user?.role);
    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError('Ошибка при загрузке курсов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/courses/${courseId}/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при подписке на курс');
      }

      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnsubscribe = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/courses/${courseId}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при отписке от курса');
      }

      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="courses-container">
      <h3 className="courses-title">Все курсы</h3>
      
      {courses.length === 0 ? (
        <div className="no-courses">Нет доступных курсов</div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => {
            const userId = JSON.parse(localStorage.getItem('user')).id;
            const isSubscribed = course.students?.some(student => student._id === userId);

            return (
              <div 
                key={course._id} 
                className={`course-card ${isSubscribed ? 'subscribed' : ''}`}
                onClick={() => handleCourseClick(course._id)}
              >
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <p>Преподаватель: {course.teacher.firstName} {course.teacher.lastName}</p>
                
                {userRole === 'student' && (
                  isSubscribed ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsubscribe(course._id);
                      }}
                      className="unsubscribe-btn"
                    >
                      Отписаться
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubscribe(course._id);
                      }}
                      className="subscribe-btn"
                    >
                      Подписаться
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllCourses;