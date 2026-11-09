import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Basket from './Basket'
import Menu from './Menu'
import Shop from './Shop'
import './App.css'

function App() {
  const [cart, updateCart] = useState([])

  const cartCount = cart.reduce((total, item) => total + item.count, 0)

  return (
    <BrowserRouter>
      <Menu cartCount={cartCount} />
      <Routes>
        <Route
          path="/"
          element={<Shop cart={cart} updateCart={updateCart} />}
        />
        <Route
          path="/basket"
          element={<Basket cart={cart} updateCart={updateCart} />}
        />
        <Route path="*" element={<Shop cart={cart} updateCart={updateCart} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
