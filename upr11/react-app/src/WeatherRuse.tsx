import { useEffect, useState } from 'react'

const WEATHER_INTERVAL = 10 * 60 * 1000
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY?.trim()

interface WeatherData {
  location: {
    name: string
    country: string
    localtime: string
  }
  current: {
    temp_c: number
    feelslike_c: number
    humidity: number
    wind_kph: number
    last_updated: string
    condition: {
      text: string
      icon: string
    }
  }
}

function WeatherRuse() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(Boolean(WEATHER_API_KEY))
  const [refreshNumber, setRefreshNumber] = useState(0)

  useEffect(() => {
    if (!WEATHER_API_KEY) return

    const controller = new AbortController()

    async function loadWeather() {
      try {
        const search = new URLSearchParams({
          key: WEATHER_API_KEY,
          q: 'Ruse,Bulgaria',
          aqi: 'no',
          lang: 'bg',
        })
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?${search.toString()}`,
          { signal: controller.signal },
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error?.message || `HTTP грешка ${response.status}`)
        }

        setWeather(data as WeatherData)
        setError('')
      } catch (requestError) {
        if ((requestError as Error).name !== 'AbortError') {
          setError((requestError as Error).message)
        }
      } finally {
        setLoading(false)
      }
    }

    loadWeather()
    const intervalId = window.setInterval(loadWeather, WEATHER_INTERVAL)

    return () => {
      window.clearInterval(intervalId)
      controller.abort()
    }
  }, [refreshNumber])

  function refreshWeather() {
    setLoading(true)
    setRefreshNumber((current) => current + 1)
  }

  return (
    <section className="dashboard-section weather-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WeatherAPI.com</p>
          <h2>Времето в Русе</h2>
        </div>
        {WEATHER_API_KEY && (
          <button type="button" onClick={refreshWeather} disabled={loading}>
            {loading ? 'Обновяване…' : 'Обнови сега'}
          </button>
        )}
      </div>

      {!WEATHER_API_KEY && (
        <div className="weather-setup">
          <strong>Не е зададен WeatherAPI ключ.</strong>
          <p>
            Добавете ключа като <code>VITE_WEATHER_API_KEY</code> във файла
            <code> upr11/.env</code> и рестартирайте контейнера.
          </p>
        </div>
      )}

      {WEATHER_API_KEY && weather && (
        <div className="weather-card">
          <img
            src={`https:${weather.current.condition.icon}`}
            alt={weather.current.condition.text}
          />
          <div className="temperature">
            <strong>{weather.current.temp_c.toFixed(1)}°C</strong>
            <span>{weather.current.condition.text}</span>
          </div>
          <dl>
            <div><dt>Усеща се</dt><dd>{weather.current.feelslike_c.toFixed(1)}°C</dd></div>
            <div><dt>Влажност</dt><dd>{weather.current.humidity}%</dd></div>
            <div><dt>Вятър</dt><dd>{weather.current.wind_kph} km/h</dd></div>
            <div><dt>Актуално към</dt><dd>{weather.current.last_updated}</dd></div>
          </dl>
        </div>
      )}

      {WEATHER_API_KEY && !weather && loading && (
        <p className="weather-setup">Зареждане на текущото време…</p>
      )}
      {error && <p className="inline-error">{error}</p>}
      {WEATHER_API_KEY && (
        <p className="updated-time">Автоматично обновяване на всеки 10 минути.</p>
      )}
    </section>
  )
}

export default WeatherRuse
