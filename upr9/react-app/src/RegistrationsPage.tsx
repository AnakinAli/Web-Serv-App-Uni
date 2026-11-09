import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getExcursions, getRegistrations } from './api'
import type { AdminSession, Excursion, Registration } from './types'

interface RegistrationsPageProps {
  session: AdminSession | null
}

function RegistrationsPage({ session }: RegistrationsPageProps) {
  const [excursions, setExcursions] = useState<Excursion[]>([])
  const [excursionId, setExcursionId] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) return

    getExcursions()
      .then((data) => {
        setExcursions(data)
        setExcursionId(data[0]?.id || '')
      })
      .catch((requestError: Error) => setError(requestError.message))
  }, [session])

  useEffect(() => {
    if (!session || !excursionId) return

    getRegistrations(excursionId, session.token)
      .then(setRegistrations)
      .catch((requestError: Error) => setError(requestError.message))
  }, [excursionId, session])

  if (!session) {
    return (
      <main className="narrow-page">
        <div className="message auth-message">
          <h1>Необходим е администраторски вход</h1>
          <p>Регистрациите са достъпни само за влезли потребители.</p>
          <Link className="primary-link" to="/login">
            Към страницата за вход
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-content">
      <div className="section-heading">
        <p className="eyebrow">Администрация</p>
        <h1>Регистрации по екскурзия</h1>
      </div>
      <label className="filter-label">
        Изберете екскурзия
        <select
          value={excursionId}
          onChange={(event) => setExcursionId(event.target.value)}
        >
          {excursions.map((excursion) => (
            <option value={excursion.id} key={excursion.id}>
              {excursion.title}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="message error-message">{error}</p>}
      {!error && registrations.length === 0 && (
        <p className="message">Няма регистрации за избраната екскурзия.</p>
      )}
      {registrations.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Име</th>
                <th>Екскурзия</th>
                <th>Дата</th>
                <th>Код за отказ</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id}>
                  <td>{registration.name}</td>
                  <td>{registration.excursionTitle}</td>
                  <td>{new Date(registration.createdAt).toLocaleString('bg-BG')}</td>
                  <td><code>{registration.cancellationCode}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default RegistrationsPage
