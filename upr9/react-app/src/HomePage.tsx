import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getExcursions } from './api'
import type { Excursion } from './types'

function HomePage() {
  const [excursions, setExcursions] = useState<Excursion[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getExcursions(true).then(setExcursions).catch((requestError: Error) => {
      setError(requestError.message)
    })
  }, [])

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Следващото приключение започва тук</p>
          <h1>Екскурзии в България</h1>
          <p>Изберете дестинация и запазете своето място онлайн.</p>
          <Link className="primary-link" to="/register">
            Запиши се
          </Link>
        </div>
      </section>

      <section className="page-content">
        <div className="section-heading">
          <h2>Свободни екскурзии</h2>
          <p>Пълните екскурзии автоматично се скриват.</p>
        </div>
        {error && <p className="message error-message">{error}</p>}
        {!error && excursions.length === 0 && (
          <p className="message">В момента няма екскурзии със свободни места.</p>
        )}
        <div className="excursions-grid">
          {excursions.map((excursion) => (
            <article className="excursion-card" key={excursion.id}>
              <img src={excursion.image} alt={excursion.title} />
              <div className="card-content">
                <h3>{excursion.title}</h3>
                <p>{excursion.description}</p>
                <div className="card-meta">
                  <strong>{excursion.price.toFixed(2)} лв.</strong>
                  <span>Свободни места: {excursion.availablePlaces}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage
