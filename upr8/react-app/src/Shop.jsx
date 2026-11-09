import { useEffect, useState } from 'react'

function getImageSource(image) {
  if (!image) {
    return '/products/placeholder.svg'
  }

  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
    return image
  }

  return `/products/${image}`
}

function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function loadProducts() {
      try {
        const response = await fetch('http://localhost:3001/products', {
          signal: controller.signal,
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || data.error || `HTTP грешка ${response.status}`)
        }

        if (active) {
          setProducts(data)
          setError('')
        }
      } catch (requestError) {
        if (active && requestError.name !== 'AbortError') {
          setError(requestError.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">Store1Database</p>
        <h1>Продукти от Firestore</h1>
        <p>Данните се зареждат чрез Express API и Firebase Firestore.</p>
      </header>

      <section className="content">
        {loading && <p className="message">Зареждане на продуктите…</p>}

        {error && (
          <div className="message error-message">
            <strong>Продуктите не могат да бъдат заредени.</strong>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="message">Колекцията products е празна.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <img
                  src={getImageSource(product.img)}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.src = '/products/placeholder.svg'
                  }}
                />
                <div className="product-info">
                  <h2>{product.name}</h2>
                  <p>{Number(product.price).toFixed(2)} лв.</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Shop
