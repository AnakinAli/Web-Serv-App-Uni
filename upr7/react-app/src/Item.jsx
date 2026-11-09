import imgBackpack from './assets/backpack.svg'
import imgHeadphones from './assets/headphones.svg'
import imgShoes from './assets/shoes.svg'
import imgTshirt from './assets/tshirt.svg'

const productImages = {
  'tshirt.svg': imgTshirt,
  'shoes.svg': imgShoes,
  'headphones.svg': imgHeadphones,
  'backpack.svg': imgBackpack,
}

function Item(props) {
  function addToCart() {
    const existingItem = props.cart.find(
      (cartItem) => cartItem.id === props.itemData.id,
    )

    if (existingItem) {
      props.updateCart(
        props.cart.map((cartItem) =>
          cartItem.id === props.itemData.id
            ? { ...cartItem, count: cartItem.count + 1 }
            : cartItem,
        ),
      )
      return
    }

    props.updateCart([...props.cart, { ...props.itemData, count: 1 }])
  }

  return (
    <article className="item-card">
      <div className="item-image-wrapper">
        <img
          className="item-image"
          src={productImages[props.itemData.img]}
          alt={props.itemData.name}
        />
      </div>
      <div className="item-details">
        <h2>{props.itemData.name}</h2>
        <p className="price">{Number(props.itemData.price).toFixed(2)} лв.</p>
        <button type="button" onClick={addToCart}>
          Добави в количката
        </button>
      </div>
    </article>
  )
}

export default Item
