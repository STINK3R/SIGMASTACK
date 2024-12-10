import React, { useState } from 'react';
import headWithGlasses from './img/head-with-glasses.png';
import headWithout from './img/head-without.png';
// import PurpleCircle from './img/back-purple-circle.png';


function RegistrationPage() {
    const [role, setRole] = useState('');

const handleSubmit = (event) => {
        event.preventDefault();
        if (!role) {
          alert('Пожалуйста, выберите вашу роль.');
          return;
        }
        alert(`Вы зарегистрированы как: ${role}`);
        // Здесь можно добавить логику для отправки данных на сервер
      };


  return (
    <div className="form-page">
      <h2>Регистрация</h2>
      <form>
        <label>
          Имя:
          <input type="text" id='Firsname' required />
        </label>
        <label>
          Фамилия:
          <input type="text" id='surname' required />
        </label>
       
        <label>
          Отчество:
          <input type="text" id='surname2' required />
        </label>
        <label>
          Электронная почта:
          <input type="email" required />
        </label>
        <label>
          Пароль:
          <input type="password" required />
        </label>
        <fieldset>
          <legend>Выберите вашу роль:</legend>
          <div className='iam'>Я Ученик</div>
          <label>
            <input
              type="radio"
              name="role"
              value="Ученик"
              checked={role === 'Ученик'}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
          <div className='iam'>Я Преподаватель</div>
          <label>
          
            <input
              type="radio"
              name="role"
              value="Преподаватель"
              checked={role === 'Преподаватель'}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
          <div className='iam'>Я Наниматель</div>
          <label>
         
            <input
              type="radio"
              name="role"
              value="Наниматель"
              checked={role === 'Наниматель'}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
        </fieldset>
        <button className='button-auth' type="submit">Зарегистрироваться</button>
      </form>
      
      <div className='characters1'>
      <div className="character character-11">
              <img
                src={headWithout}
                alt="Character with bun"
                width={250}
                height={200}
              />
            </div>
            <div className="character character-22">
              <img
                src={headWithGlasses}
                alt="Character with glasses"
                width={250}
                height={200}
              />
            </div>
            </div>
    </div>
  );
}

export default RegistrationPage;
