import { useEffect, useRef, useState } from 'react'

const COINCAP_API_KEY = import.meta.env.VITE_COINCAP_API_KEY?.trim()
const SOCKET_URL = `wss://ws.coincap.io/prices?assets=bitcoin,ethereum${
  COINCAP_API_KEY ? `&apiKey=${encodeURIComponent(COINCAP_API_KEY)}` : ''
}`

interface Prices {
  bitcoin: number | null
  ethereum: number | null
}

const currencyFormatter = new Intl.NumberFormat('bg-BG', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function CryptoPrices() {
  const [prices, setPrices] = useState<Prices>({
    bitcoin: null,
    ethereum: null,
  })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [socketError, setSocketError] = useState('')
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING)
  const noDataTimer = useRef<number | null>(null)

  useEffect(() => {
    let reconnectTimer: number | null = null
    let active = true
    let socket: WebSocket

    function connect() {
      if (!active) return
      socket = new WebSocket(SOCKET_URL)

      socket.onopen = () => {
        setReadyState(WebSocket.OPEN)
        if (noDataTimer.current !== null) window.clearTimeout(noDataTimer.current)
        noDataTimer.current = window.setTimeout(() => {
          setSocketError('Връзката е отворена, но CoinCap не изпраща цени. Проверете достъпа до WebSocket услугата.')
        }, 12000)
      }

      socket.onmessage = (event: MessageEvent<string>) => {
        try {
          const incoming = JSON.parse(event.data) as Record<string, string>
          setPrices((current) => ({
            bitcoin: incoming.bitcoin ? Number(incoming.bitcoin) : current.bitcoin,
            ethereum: incoming.ethereum ? Number(incoming.ethereum) : current.ethereum,
          }))
          setLastUpdated(new Date())
          setSocketError('')
          if (noDataTimer.current !== null) window.clearTimeout(noDataTimer.current)
        } catch {
          setSocketError('Получено е невалидно съобщение от WebSocket услугата.')
        }
      }

      socket.onerror = () => setSocketError('Възникна грешка при WebSocket връзката.')
      socket.onclose = () => {
        setReadyState(WebSocket.CLOSED)
        if (active) reconnectTimer = window.setTimeout(connect, 3000)
      }
    }

    connect()
    return () => {
      active = false
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer)
      if (noDataTimer.current !== null) window.clearTimeout(noDataTimer.current)
      socket?.close()
    }
  }, [])

  const statusText = readyState === WebSocket.CONNECTING
    ? 'Свързване…'
    : readyState === WebSocket.OPEN
      ? lastUpdated ? 'На живо' : 'Свързана'
      : readyState === WebSocket.CLOSING ? 'Затваряне…' : 'Прекъсната връзка'

  return (
    <section className="dashboard-section crypto-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CoinCap WebSocket</p>
          <h2>Криптовалути в реално време</h2>
        </div>
        <span className={`connection-status status-${readyState}`}>
          <span aria-hidden="true" />
          {statusText}
        </span>
      </div>

      <div className="crypto-grid">
        <article className="crypto-card bitcoin-card">
          <div className="coin-icon" aria-hidden="true">₿</div>
          <div>
            <h3>Bitcoin</h3>
            <p>BTC</p>
          </div>
          <strong>
            {prices.bitcoin === null
              ? 'Очакване на данни…'
              : currencyFormatter.format(prices.bitcoin)}
          </strong>
        </article>

        <article className="crypto-card ethereum-card">
          <div className="coin-icon" aria-hidden="true">Ξ</div>
          <div>
            <h3>Ethereum</h3>
            <p>ETH</p>
          </div>
          <strong>
            {prices.ethereum === null
              ? 'Очакване на данни…'
              : currencyFormatter.format(prices.ethereum)}
          </strong>
        </article>
      </div>

      {lastUpdated && (
        <p className="updated-time">
          Последна актуализация: {lastUpdated.toLocaleTimeString('bg-BG')}
        </p>
      )}
      {socketError && <p className="inline-error">{socketError}</p>}
    </section>
  )
}

export default CryptoPrices
