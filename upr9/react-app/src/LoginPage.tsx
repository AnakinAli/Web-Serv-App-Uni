import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from './api'
import type { AdminSession } from './types'

interface LoginPageProps {
  onLogin: (session: AdminSession) => void
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    try {
      const users = await login(userName, password)
      if (users.length === 0) {
        setError('Невалидно потребителско име или парола.')
        return
      }

      onLogin(users[0])
      navigate('/registrations')
    } catch (requestError) {
      setError((requestError as Error).message)
    }
  }

  return (
    <main className="narrow-page">
      <div className="section-heading">
        <p className="eyebrow">Администрация</p>
        <h1>Вход</h1>
      </div>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Потребителско име
          <input
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Парола
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit">Вход</button>
        <small>Демонстрационен вход: admin / pass</small>
      </form>
      {error && <p className="message error-message">{error}</p>}
    </main>
  )
}

export default LoginPage
