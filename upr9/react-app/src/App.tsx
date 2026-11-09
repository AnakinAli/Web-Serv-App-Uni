import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CancelPage from './CancelPage'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import Navigation from './Navigation'
import RegisterPage from './RegisterPage'
import RegistrationsPage from './RegistrationsPage'
import type { AdminSession } from './types'
import './App.css'

const SESSION_KEY = 'upr9AdminSession'

function readSession(): AdminSession | null {
  const savedSession = localStorage.getItem(SESSION_KEY)
  if (!savedSession) return null

  try {
    return JSON.parse(savedSession) as AdminSession
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

function App() {
  const [session, setSession] = useState<AdminSession | null>(readSession)

  function handleLogin(newSession: AdminSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
    setSession(newSession)
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
  }

  return (
    <BrowserRouter>
      <Navigation session={session} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route
          path="/registrations"
          element={<RegistrationsPage session={session} />}
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
