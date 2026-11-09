export interface Excursion {
  id: string
  title: string
  description: string
  image: string
  price: number
  registeredCount: number
  maxPeople: number
  availablePlaces: number
}

export interface Registration {
  id: string
  name: string
  excursionId: string
  excursionTitle: string
  cancellationCode: string
  createdAt: string
}

export interface AdminSession {
  id: string
  userName: string
  token: string
}
