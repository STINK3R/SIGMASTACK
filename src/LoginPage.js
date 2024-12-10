import React from 'react';

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
    </div>
  );
}

export default LoginPage;
