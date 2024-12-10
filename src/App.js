import './App.css';
import headWithCap from './img/head-with-cap.png';
import headWithGlasses from './img/head-with-glasses.png';
import headWithout from './img/head-without.png';



function App() {
  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="logo">
            <span className="logo-edu">Edu</span>
            <span className="logo-connect">Connect</span>
          </h1>
        </header>

        {/* Main Content */}
        <main className="main">
          {/* Left Column */}
          <div className="content">
            <h2 className="title">
              Единая экосистема для студентов преподавателей и работодателей
            </h2>
            <div className="buttons">
              <button className="button button-primary">
                Войти
              </button>
              <button className="button button-outline">
                Регистрация
              </button>
            </div>
          </div>

          {/* Right Column - Characters */}
          <div className="characters">
            <div className="character character-1">
              <img
                src={headWithout}
                alt="Character with bun"
                width={200}
                height={200}
              />
            </div>
            
            <div className="character character-2">
              <img
                src={headWithGlasses}
                alt="Character with glasses"
                width={200}
                height={200}
              />
            </div>
            
            <div className="character character-3">
              <img
                src={headWithCap}
                alt="Character with cap"
                width={200}
                height={200}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

