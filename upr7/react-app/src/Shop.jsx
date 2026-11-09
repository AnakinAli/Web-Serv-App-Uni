import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Item from './Item'

function Shop(props) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    fetch('http://localhost:8001/items/', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP грешка ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (active) {
          setItems(data)
          setError('')
        }
      })
      .catch((requestError) => {
        if (active && requestError.name !== 'AbortError') {
          setError('Продуктите не могат да бъдат заредени. Проверете дали json-server работи на порт 8001.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  const cartCount = props.cart.reduce((total, item) => total + item.count, 0)

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Онлайн каталог</p>
          <h1>Нашите продукти</h1>
        </div>
        <Link className="cart-summary" to="/basket">
          Артикули в количката: <strong>{cartCount}</strong>
        </Link>
      </div>

      {loading && <p className="status-message">Зареждане на продуктите…</p>}
      {error && <p className="status-message error-message">{error}</p>}

      {!loading && !error && (
        <section className="items-grid" aria-label="Списък с продукти">
          {items.map((item) => (
            <Item
              itemData={item}
              cart={props.cart}
              updateCart={props.updateCart}
              key={item.id}
            />
          ))}
        </section>
      )}
    </main>
  )
}

export default Shop
