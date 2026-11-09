import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003'

function App() {
  const [data, setData] = useState({ excursions: [], products: [], users: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    Promise.all([
      fetch(`${API_URL}/api/excursions`, { signal: controller.signal }),
      fetch(`${API_URL}/api/products`, { signal: controller.signal }),
      fetch(`${API_URL}/api/users`, { signal: controller.signal }),
    ])
      .then(async (responses) => {
        if (responses.some((response) => !response.ok)) {
          throw new Error('Express сървърът върна грешка.')
        }
        return Promise.all(responses.map((response) => response.json()))
      })
      .then(([excursions, products, users]) => {
        if (active) setData({ excursions, products, users })
      })
      .catch((requestError) => {
        if (active && requestError.name !== 'AbortError') {
          setError(requestError.message)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  return (
    <main>
      <header className="hero">
        <p>Упражнение 10</p>
        <h1>Express, MongoDB и Mongoose</h1>
        <span>Данните се зареждат с Fetch API от база excursions.</span>
      </header>

      <div className="page-content">
        {loading && <p className="message">Зареждане от MongoDB…</p>}
        {error && <p className="message error-message">{error}</p>}

        {!loading && !error && (
          <>
            <section>
              <div className="section-heading">
                <h2>Екскурзии</h2>
                <span>Колекция excursions</span>
              </div>
              <div className="cards-grid">
                {data.excursions.map((excursion) => (
                  <article className="card" key={excursion._id}>
                    <img src={excursion.image} alt={excursion.title} />
                    <div>
                      <h3>{excursion.title}</h3>
                      <p>{excursion.description}</p>
                      <strong>{excursion.price.toFixed(2)} лв.</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="section-heading">
                <h2>Продукти</h2>
                <span>Колекция products</span>
              </div>
              <div className="cards-grid products-grid">
                {data.products.map((product) => (
                  <article className="card" key={product._id}>
                    <img src={product.image} alt={product.name} />
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <strong>{product.price.toFixed(2)} лв. · {product.stock} бр.</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="section-heading">
                <h2>Потребители</h2>
                <span>Колекция users</span>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Име</th><th>Имейл</th><th>Възраст</th><th>Точки</th><th>Администратор</th></tr>
                  </thead>
                  <tbody>
                    {data.users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.age}</td>
                        <td>{user.points}</td>
                        <td>{user.admin ? 'Да' : 'Не'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default App
