import { type FormEvent, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { createRegistration, getExcursions } from './api'
import type { Excursion } from './types'

function RegisterPage() {
  const [excursions, setExcursions] = useState<Excursion[]>([])
  const [name, setName] = useState('')
  const [excursionId, setExcursionId] = useState('')
  const [cancellationCode, setCancellationCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadAvailableExcursions() {
    const data = await getExcursions(true)
    setExcursions(data)
    setExcursionId((current) =>
      data.some((excursion) => excursion.id === current)
        ? current
        : data[0]?.id || '',
    )
  }

  useEffect(() => {
    let active = true

    getExcursions(true)
      .then((data) => {
        if (!active) return
        setExcursions(data)
        setExcursionId(data[0]?.id || '')
      })
      .catch((requestError: Error) => {
        if (active) setError(requestError.message)
      })

    return () => {
      active = false
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      const code = uuidv4()
      const registration = await createRegistration(name, excursionId, code)
      setCancellationCode(registration.cancellationCode)
      setMessage(`Успешно записване за „${registration.excursionTitle}“.`)
      setName('')
      await loadAvailableExcursions()
    } catch (requestError) {
      setError((requestError as Error).message)
    }
  }

  return (
    <main className="narrow-page">
      <div className="section-heading">
        <p className="eyebrow">Резервирайте място</p>
        <h1>Записване за екскурзия</h1>
      </div>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Вашето име
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label>
          Екскурзия
          <select
            value={excursionId}
            onChange={(event) => setExcursionId(event.target.value)}
            required
          >
            {excursions.map((excursion) => (
              <option value={excursion.id} key={excursion.id}>
                {excursion.title} – {excursion.availablePlaces} свободни места
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={!excursionId}>
          Потвърди записването
        </button>
      </form>

      {message && (
        <div className="message success-message">
          <strong>{message}</strong>
          <span>Запазете кода за отказ:</span>
          <code>{cancellationCode}</code>
        </div>
      )}
      {error && <p className="message error-message">{error}</p>}
    </main>
  )
}

export default RegisterPage
