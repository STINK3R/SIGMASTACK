import React from 'react';

function RegistrationPage() {
  return (
    <div className="form-page">
      <h2>Регистрация</h2>
      <form>
        <label>
          Имя:
          <input type="text" required />
        </label>
        <label>
          Электронная почта:
          <input type="email" required />
        </label>
        <label>
          Пароль:
          <input type="password" required />
        </label>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default RegistrationPage;
