import React from 'react';
import headWithGlasses from './img/head-with-glasses.png';
import headWithout from './img/head-without.png';

function LoginPage() {
  return (
    <div className="form-page">
      <h2>Вход</h2>
      <form>
        <label>
          Электронная почта:
          <input type="email" required />
        </label>
        <label>
          Пароль:
          <input type="password" required />
        </label>
        <button type="submit">Войти</button>
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

export default LoginPage;
