import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import './CoursePage.css';

const CoursePage = () => {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(null); // topicId или null
  const [newTopic, setNewTopic] = useState({ title: '', description: '' });
  const [newLesson, setNewLesson] = useState({
    title: '',
    content: '',
    materials: []
  });
  const [newMaterial, setNewMaterial] = useState({
    type: 'text',
    title: '',
    content: '',
    file: null
  });
  const [showAddMaterial, setShowAddMaterial] = useState(null); // lessonId или null
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.role);
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (course && userRole === 'student') {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      setIsSubscribed(course.students.some(student => student._id === userId));
    }
  }, [course, userRole]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Курс не найден');
      }
      
      const data = await response.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    try {
      console.log('Отправка запроса на добавление темы:', newTopic);
      const response = await fetch(`http://localhost:4000/api/courses/${courseId}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newTopic)
      });

      const data = await response.json();
      console.log('Ответ сервера:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при добавлении темы');
      }

      setCourse(data);
      setShowAddTopic(false);
      setNewTopic({ title: '', description: '' });
    } catch (err) {
      console.error('Ошибка при добавлении темы:', err);
      setError(err.message);
    }
  };

  const handleAddLesson = async (e, topicId) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/courses/${courseId}/topics/${topicId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newLesson)
      });

      if (!response.ok) {
        throw new Error('Ошибка при добавлении урока');
      }

      const updatedCourse = await response.json();
      setCourse(updatedCourse);
      setShowAddLesson(null);
      setNewLesson({ title: '', content: '', materials: [] });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке файла');
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      throw err;
    }
  };

  const handleAddMaterial = async (e, lessonId, topicId) => {
    e.preventDefault();
    try {
      let materialContent = newMaterial.content;

      if (newMaterial.type === 'file' && newMaterial.file) {
        materialContent = await handleFileUpload(newMaterial.file);
      }

      const response = await fetch(
        `http://localhost:4000/api/courses/${courseId}/topics/${topicId}/lessons/${lessonId}/materials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: newMaterial.title,
            type: newMaterial.type,
            content: materialContent
          })
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка при добавлении материала');
      }

      const updatedCourse = await response.json();
      setCourse(updatedCourse);
      setShowAddMaterial(null);
      setNewMaterial({ type: 'text', title: '', content: '', file: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!course) return <div>Курс не найден</div>;

  const isTeacher = userRole === 'teacher' && course.teacher._id === JSON.parse(localStorage.getItem('user')).id;

  return (
    <div className="course-page">
      <main className="course-content">
        <h1 className="course-title">{course.title}</h1>
        <div className="course-info">
          <p className="course-description">{course.description}</p>
          <div className="teacher-info">
            <h3>Преподаватель:</h3>
            <p>{course.teacher.firstName} {course.teacher.lastName}</p>
            <p>Email: {course.teacher.email}</p>
          </div>

          <div className="topics-section">
            <div className="topics-header">
              <h3>Темы курса</h3>
              {isTeacher && (
                <button 
                  className="add-topic-btn"
                  onClick={() => setShowAddTopic(true)}
                >
                  Добавить тему
                </button>
              )}
            </div>

            {showAddTopic && (
              <form onSubmit={handleAddTopic} className="add-form">
                <h4>Новая тема</h4>
                <input
                  type="text"
                  placeholder="Название темы"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Описание темы"
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                />
                <div className="form-buttons">
                  <button type="submit">Создать</button>
                  <button type="button" onClick={() => setShowAddTopic(false)}>Отмена</button>
                </div>
              </form>
            )}

            <div className="topics-list">
              {course.topics?.sort((a, b) => a.order - b.order).map(topic => (
                <div key={topic._id} className="topic-item">
                  <h4>{topic.title}</h4>
                  <p>{topic.description}</p>

                  <div className="lessons-list">
                    {topic.lessons?.sort((a, b) => a.order - b.order).map(lesson => (
                      <div key={lesson._id} className="lesson-item">
                        <h5>{lesson.title}</h5>
                        <p>{lesson.content}</p>
                        {lesson.materials?.length > 0 && (
                          <div className="materials-list">
                            <h6>Материалы:</h6>
                            <ul>
                              {lesson.materials.map((material, idx) => (
                                <li key={idx}>
                                  {material.type === 'link' ? (
                                    <a href={material.content} target="_blank" rel="noopener noreferrer">
                                      {material.title}
                                    </a>
                                  ) : (
                                    <span>{material.title}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {isTeacher && (
                          <div className="material-controls">
                            <button 
                              className="add-material-btn"
                              onClick={() => setShowAddMaterial(lesson._id)}
                            >
                              Добавить материал
                            </button>

                            {showAddMaterial === lesson._id && (
                              <form onSubmit={(e) => handleAddMaterial(e, lesson._id, topic._id)} className="add-material-form">
                                <h4>Новый материал</h4>
                                <div className="material-type-selector">
                                  <button
                                    type="button"
                                    className={`type-btn ${newMaterial.type === 'text' ? 'active' : ''}`}
                                    onClick={() => setNewMaterial({...newMaterial, type: 'text'})}
                                  >
                                    Текст
                                  </button>
                                  <button
                                    type="button"
                                    className={`type-btn ${newMaterial.type === 'link' ? 'active' : ''}`}
                                    onClick={() => setNewMaterial({...newMaterial, type: 'link'})}
                                  >
                                    Ссылка
                                  </button>
                                  <button
                                    type="button"
                                    className={`type-btn ${newMaterial.type === 'file' ? 'active' : ''}`}
                                    onClick={() => setNewMaterial({...newMaterial, type: 'file'})}
                                  >
                                    Файл
                                  </button>
                                </div>

                                <input
                                  type="text"
                                  placeholder="Название материала"
                                  value={newMaterial.title}
                                  onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                                  required
                                />

                                {newMaterial.type === 'file' ? (
                                  <input
                                    type="file"
                                    onChange={(e) => setNewMaterial({...newMaterial, file: e.target.files[0]})}
                                    required
                                  />
                                ) : (
                                  <input
                                    type={newMaterial.type === 'link' ? 'url' : 'text'}
                                    placeholder={newMaterial.type === 'link' ? 'URL' : 'Содержание'}
                                    value={newMaterial.content}
                                    onChange={(e) => setNewMaterial({...newMaterial, content: e.target.value})}
                                    required
                                  />
                                )}

                                <div className="form-buttons">
                                  <button type="submit">Добавить</button>
                                  <button type="button" onClick={() => setShowAddMaterial(null)}>Отмена</button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {isTeacher && (
                      <button 
                        className="add-lesson-btn"
                        onClick={() => setShowAddLesson(topic._id)}
                      >
                        Добавить урок
                      </button>
                    )}

                    {showAddLesson === topic._id && (
                      <form onSubmit={(e) => handleAddLesson(e, topic._id)} className="add-form">
                        <h4>Новый урок</h4>
                        <input
                          type="text"
                          placeholder="Название урока"
                          value={newLesson.title}
                          onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                          required
                        />
                        <textarea
                          placeholder="Содержание урока"
                          value={newLesson.content}
                          onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                          required
                        />
                        <div className="form-buttons">
                          <button type="submit">Создать</button>
                          <button type="button" onClick={() => setShowAddLesson(null)}>Отмена</button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage; 