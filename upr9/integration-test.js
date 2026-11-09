const baseUrl = 'http://localhost:3002/api'

async function request(path, options) {
  const response = await fetch(baseUrl + path, options)
  const data = await response.json()
  if (!response.ok) throw new Error(`${response.status}: ${JSON.stringify(data)}`)
  return data
}

const health = await request('/health')
const excursions = await request('/excursions?available=true')
const selected = excursions[0]
const cancellationCode = crypto.randomUUID()

await request('/registrations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Integration Test',
    excursionId: selected.id,
    cancellationCode,
  }),
})

const users = await request('/users?userName=admin&password=pass')
const registrations = await request(
  `/registrations?excursionId=${selected.id}`,
  { headers: { Authorization: `Bearer ${users[0].token}` } },
)

if (!registrations.some((entry) => entry.cancellationCode === cancellationCode)) {
  throw new Error('Новата регистрация не присъства в администраторския списък.')
}

await request(`/registrations/${cancellationCode}`, { method: 'DELETE' })
const updatedExcursions = await request('/excursions')
const updated = updatedExcursions.find((entry) => entry.id === selected.id)

if (updated.registeredCount !== selected.registeredCount) {
  throw new Error('Свободното място не е възстановено след отказа.')
}

console.log({
  health,
  excursion: selected.title,
  registrationCreated: true,
  adminLogin: true,
  registrationListed: true,
  cancellationCompleted: true,
  capacityRestored: true,
})
