import { type FormEvent, useState } from 'react'
import { cancelRegistration } from './api'

function CancelPage() {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      const result = await cancelRegistration(code.trim())
      setMessage(result.message)
      setCode('')
    } catch (requestError) {
      setError((requestError as Error).message)
    }
  }

  return (
    <main className="narrow-page">
      <div className="section-heading">
        <p className="eyebrow">Промяна на плановете</p>
        <h1>Отказ на регистрация</h1>
      </div>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Код за отказ
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            required
          />
        </label>
        <button type="submit">Откажи регистрацията</button>
      </form>
      {message && <p className="message success-message">{message}</p>}
      {error && <p className="message error-message">{error}</p>}
    </main>
  )
}

export default CancelPage
