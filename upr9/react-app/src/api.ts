import type { AdminSession, Excursion, Registration } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `HTTP грешка ${response.status}`)
  }

  return data as T
}

export function getExcursions(onlyAvailable = false) {
  return request<Excursion[]>(
    `/excursions${onlyAvailable ? '?available=true' : ''}`,
  )
}

export function createRegistration(
  name: string,
  excursionId: string,
  cancellationCode: string,
) {
  return request<Registration>('/registrations', {
    method: 'POST',
    body: JSON.stringify({ name, excursionId, cancellationCode }),
  })
}

export function cancelRegistration(cancellationCode: string) {
  return request<{ message: string }>(
    `/registrations/${encodeURIComponent(cancellationCode)}`,
    { method: 'DELETE' },
  )
}

export function login(userName: string, password: string) {
  const search = new URLSearchParams({ userName, password })
  return request<AdminSession[]>(`/users?${search.toString()}`)
}

export function getRegistrations(excursionId: string, token: string) {
  const search = new URLSearchParams({ excursionId })
  return request<Registration[]>(`/registrations?${search.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
