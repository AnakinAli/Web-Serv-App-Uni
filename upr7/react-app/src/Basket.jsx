import { Link } from 'react-router-dom'

function Basket(props) {
  function changeCount(itemId, difference) {
    props.updateCart(
      props.cart
        .map((item) =>
          item.id === itemId
            ? { ...item, count: item.count + difference }
            : item,
        )
        .filter((item) => item.count > 0),
    )
  }

  function deleteItem(itemId) {
    props.updateCart(props.cart.filter((item) => item.id !== itemId))
  }

  const totalPrice = props.cart.reduce(
    (total, item) => total + Number(item.price) * item.count,
    0,
  )

  return (
    <main className="page-content basket-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Вашата поръчка</p>
          <h1>Количка</h1>
        </div>
        <Link className="secondary-link" to="/">
          ← Обратно към продуктите
        </Link>
      </div>

      {props.cart.length === 0 ? (
        <section className="empty-basket">
          <h2>Количката е празна</h2>
          <p>Добавете продукт от страницата на магазина.</p>
          <Link className="primary-link" to="/">
            Разгледай продуктите
          </Link>
        </section>
      ) : (
        <>
          <section className="basket-list">
            {props.cart.map((item) => (
              <article className="basket-row" key={item.id}>
                <div>
                  <h2>{item.name}</h2>
                  <p>{Number(item.price).toFixed(2)} лв. за брой</p>
                </div>
                <div className="quantity-controls" aria-label={`Количество за ${item.name}`}>
                  <button
                    type="button"
                    aria-label="Намали количеството"
                    onClick={() => changeCount(item.id, -1)}
                  >
                    −
                  </button>
                  <strong>{item.count}</strong>
                  <button
                    type="button"
                    aria-label="Увеличи количеството"
                    onClick={() => changeCount(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <strong className="line-total">
                  {(Number(item.price) * item.count).toFixed(2)} лв.
                </strong>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => deleteItem(item.id)}
                >
                  Изтрий
                </button>
              </article>
            ))}
          </section>
          <div className="basket-total">
            Общо: <strong>{totalPrice.toFixed(2)} лв.</strong>
          </div>
        </>
      )}
    </main>
  )
}

export default Basket
