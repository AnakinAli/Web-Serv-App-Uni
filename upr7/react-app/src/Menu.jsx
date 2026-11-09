import { NavLink } from 'react-router-dom'

function Menu(props) {
  return (
    <header className="site-header">
      <div className="menu-content">
        <NavLink className="brand" to="/">
          React магазин
        </NavLink>
        <nav className="main-menu" aria-label="Основна навигация">
          <NavLink to="/">Продукти</NavLink>
          <NavLink to="/basket">Количка ({props.cartCount})</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Menu
