import { NavLink } from 'react-router-dom'
import type { AdminSession } from './types'

interface NavigationProps {
  session: AdminSession | null
  onLogout: () => void
}

function Navigation({ session, onLogout }: NavigationProps) {
  return (
    <header className="site-header">
      <div className="navigation">
        <NavLink className="brand" to="/">
          Пътувай с нас
        </NavLink>
        <nav aria-label="Основна навигация">
          <NavLink to="/">Екскурзии</NavLink>
          <NavLink to="/register">Записване</NavLink>
          <NavLink to="/cancel">Отказ</NavLink>
          <NavLink to="/registrations">Регистрации</NavLink>
          {session ? (
            <button className="nav-button" type="button" onClick={onLogout}>
              Изход ({session.userName})
            </button>
          ) : (
            <NavLink to="/login">Вход</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navigation
