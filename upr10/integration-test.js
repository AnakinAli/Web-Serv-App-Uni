const baseUrl = 'http://localhost:3003'

async function request(path, options) {
  const response = await fetch(baseUrl + path, options)
  const data = await response.json()
  if (!response.ok) throw new Error(`${response.status}: ${JSON.stringify(data)}`)
  return data
}

const suffix = crypto.randomUUID().slice(0, 8)
const user = await request('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: `test-${suffix}`,
    password: 'temporary',
    email: `test-${suffix}@example.com`,
    age: 20,
    points: 5,
    admin: false,
  }),
})

const updated = await request(`/api/users/${user._id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ points: 17 }),
})

if (updated.points !== 17) {
  throw new Error('Потребителят не е обновен.')
}

await request(`/api/users/${user._id}`, { method: 'DELETE' })

console.log({
  userCreated: true,
  userUpdated: true,
  userDeleted: true,
})
