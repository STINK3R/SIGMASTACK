import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCourses.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: ''
  });
  const [subscribedCourses, setSubscribedCourses] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    console.log('Текущий пользователь:', user);
    console.log('Токен:', token);
    
    if (!token) {
      navigate('/login');
      return;
    }

    setUserRole(user?.role);
    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/courses?type=subscribed', {
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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCourse)
      });
      
      if (response.ok) {
        fetchCourses();
        setShowCreateForm(false);
        setNewCourse({ title: '', description: '' });
      }
    } catch (err) {
      setError('Ошибка при создании курса');
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Отправка запроса на обновление курса:', editingCourse);

      const response = await fetch(`http://localhost:4000/api/courses/${editingCourse._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingCourse.title,
          description: editingCourse.description
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении курса');
      }

      const data = await response.json();
      console.log('Ответ сервера:', data);

      fetchCourses(); // Обновляем список курсов
      setEditingCourse(null); // Закрываем форму редактирования
      alert('Курс успешно обновлен');
    } catch (err) {
      console.error('Ошибка при обновлении курса:', err);
      setError(err.message || 'Ошибка при обновлении курса');
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleEditClick = (e, course) => {
    e.stopPropagation(); // Предотвращаем переход на страницу курса
    console.log('Редактирование курса:', course);
    setEditingCourse({
      _id: course._id,
      title: course.title,
      description: course.description
    });
  };

  const handleSubscribe = async (courseId) => {
    try {
      console.log('Подписка на курс:', courseId);
      const response = await fetch(`http://localhost:4000/api/courses/${courseId}/subscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      console.log('Ответ сервера:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при подписке на курс');
      }

      // Обновляем список подписок
      setSubscribedCourses(prev => new Set([...prev, courseId]));
      // Обновляем список курсов
      fetchCourses();
    } catch (err) {
      console.error('Ошибка при подписке:', err);
      setError(err.message);
    }
  };

  const handleUnsubscribe = async (courseId) => {
    try {
      console.log('Отписка от курса:', courseId);
      const response = await fetch(`http://localhost:4000/api/courses/${courseId}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      console.log('Ответ сервера:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при отписке от курса');
      }

      // Обновляем список подписок
      setSubscribedCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
      // Обновляем список курсов
      fetchCourses();
    } catch (err) {
      console.error('Ошибка при отписке:', err);
      setError(err.message);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="courses-container">
      <h3 className="courses-title">Мои курсы</h3>
      
      {userRole === 'teacher' && (
        <button 
          className="create-course-btn"
          onClick={() => setShowCreateForm(true)}
        >
          Создать новый курс
        </button>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateCourse} className="create-course-form">
          <input
            type="text"
            placeholder="Название курса"
            value={newCourse.title}
            onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Описание курса"
            value={newCourse.description}
            onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
            required
          />
          <button type="submit">Создать</button>
          <button type="button" onClick={() => setShowCreateForm(false)}>Отмена</button>
        </form>
      )}

      {editingCourse && (
        <form onSubmit={handleUpdateCourse} className="edit-course-form">
          <h4>Редактирование курса</h4>
          <input
            type="text"
            placeholder="Название курса"
            value={editingCourse.title}
            onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Описание курса"
            value={editingCourse.description}
            onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
            required
          />
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setEditingCourse(null)}>Отмена</button>
        </form>
      )}

      {courses.length === 0 ? (
        <div className="no-courses">
          {userRole === 'teacher' ? 
            'У вас пока нет созданных курсов. Создайте свой первый курс!' :
            'Вы пока не подписаны ни на один курс.'
          }
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div 
              key={course._id} 
              className={`course-card ${
                course.students?.includes(JSON.parse(localStorage.getItem('user')).id) 
                  ? 'subscribed' 
                  : ''
              }`}
              onClick={() => handleCourseClick(course._id)}
            >
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <p>Преподаватель: {course.teacher.firstName} {course.teacher.lastName}</p>
              
              {userRole === 'teacher' && course.teacher._id === JSON.parse(localStorage.getItem('user')).id && (
                <button 
                  className="edit-btn"
                  onClick={(e) => handleEditClick(e, course)}
                >
                  Редактировать
                </button>
              )}
              
              {userRole === 'student' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsubscribe(course._id);
                  }}
                  className="unsubscribe-btn"
                >
                  Отписаться
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;