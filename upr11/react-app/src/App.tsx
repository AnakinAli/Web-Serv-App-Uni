import CryptoPrices from './CryptoPrices'
import WeatherRuse from './WeatherRuse'
import './App.css'

function App() {
  return (
    <main>
      <header className="hero">
        <div>
          <p>Упражнение 11</p>
          <h1>Live информационно табло</h1>
          <span>WebSocket цени и текущо време</span>
        </div>
      </header>
      <div className="dashboard">
        <CryptoPrices />
        <WeatherRuse />
      </div>
    </main>
  )
}

export default App
