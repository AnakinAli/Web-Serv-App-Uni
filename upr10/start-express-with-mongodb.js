import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { getSingleUser, test } from './mongoDB.js'
import {
  connectMongoose,
  Excursion,
  Product,
  seedDatabase,
  User,
} from './models.js'

await connectMongoose()
await seedDatabase()

const app = express()
const port = Number(process.env.PORT) || 3003

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.json({
    message: 'Express и MongoDB работят успешно.',
    database: 'excursions',
    endpoints: ['/api/excursions', '/api/products', '/api/users'],
  })
})

app.get('/page2/', (req, res) => {
  res.type('html').send(`
    <h1>Page 2</h1>
    <hr>
    <a href="/">Към начало</a>
    <hr>
  `)
})

app.get('/received/:id', (req, res) => {
  res.send(`Полученото id е: ${req.params.id}`)
})

app.post('/', (req, res) => {
  res.json({ message: 'POST заявката е получена.', body: req.body })
})

app.put('/', (req, res) => {
  res.send('PUT заявка')
})

app.delete('/', (req, res) => {
  res.send('DELETE заявка')
})

app.get('/mongo/mongodb', async (req, res) => {
  res.json(await getSingleUser())
})

app.get('/mongo/test', async (req, res) => {
  res.json(await test())
})

app.get('/api/health', async (req, res) => {
  await mongoose.connection.db.admin().ping()
  res.json({ status: 'ok', database: 'excursions', driver: 'mongoose' })
})

app.get('/api/excursions', async (req, res) => {
  const excursions = await Excursion.find().sort({ title: 1 })
  res.json(excursions)
})

app.get('/api/products', async (req, res) => {
  const products = await Product.find().sort({ name: 1 })
  res.json(products)
})

app.get('/api/users', async (req, res) => {
  const users = await User.find().select('-password').sort({ username: 1 })
  res.json(users)
})

app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body)
  const safeUser = user.toObject()
  delete safeUser.password
  res.status(201).json(safeUser)
})

app.put('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true },
  ).select('-password')

  if (!user) {
    res.status(404).json({ error: 'Потребителят не е намерен.' })
    return
  }

  res.json(user)
})

app.delete('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    res.status(404).json({ error: 'Потребителят не е намерен.' })
    return
  }

  res.json({ message: 'Потребителят е изтрит.' })
})

app.use((req, res) => {
  res.status(404).send('Грешка 404. Страницата не е намерена.')
})

app.use((error, req, res, next) => {
  console.error(error)

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    res.status(400).json({ error: error.message })
    return
  }

  if (error.code === 11000) {
    res.status(409).json({ error: 'Вече съществува запис с тази уникална стойност.' })
    return
  }

  res.status(500).json({ error: 'Вътрешна грешка в сървъра.' })
})

app.listen(port, () => {
  console.log(`Express server: http://localhost:${port}`)
})
