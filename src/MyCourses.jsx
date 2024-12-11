import React from 'react';

const MyCourses = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold">Мои курсы</h3>
      <div className="grid grid-cols-3 mt-4">
        <div className="course-card">Курс 1</div>
        <div className="course-card">Курс 2</div>
        <div className="course-card">Курс 3</div>
        <div className="course-card">Курс 4</div>
        <div className="course-card">Курс 5</div>
        <div className="course-card">Курс 6</div>
      </div>
    </div>
  );
};

export default MyCourses;