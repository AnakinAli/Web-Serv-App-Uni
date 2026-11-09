import cors from 'cors'
import express from 'express'
import { readFile } from 'node:fs/promises'
import { MongoClient, ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const port = Number(process.env.PORT) || 3002
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const databaseName = process.env.MONGODB_DATABASE || 'excursions_app'
const sessions = new Map()

const mongoClient = new MongoClient(mongoUri)
await mongoClient.connect()

const database = mongoClient.db(databaseName)
const excursionsCollection = database.collection('excursions')
const registrationsCollection = database.collection('registrations')
const usersCollection = database.collection('users')

async function seedDatabase() {
  const source = JSON.parse(await readFile(new URL('./data.json', import.meta.url), 'utf8'))

  if ((await excursionsCollection.countDocuments()) === 0) {
    await excursionsCollection.insertMany(
      source.excursions.map(({ id, ...excursion }) => excursion),
    )
  }

  if ((await usersCollection.countDocuments()) === 0) {
    await usersCollection.insertMany(
      source.users.map(({ id, ...user }) => user),
    )
  }

  await registrationsCollection.createIndex(
    { cancellationCode: 1 },
    { unique: true },
  )
  await usersCollection.createIndex({ userName: 1 }, { unique: true })
}

await seedDatabase()

const app = express()
app.use(cors())
app.use(express.json())

function serializeExcursion(excursion) {
  return {
    id: excursion._id.toString(),
    title: excursion.title,
    description: excursion.description,
    image: excursion.image,
    price: excursion.price,
    registeredCount: excursion.registeredCount,
    maxPeople: excursion.maxPeople,
    availablePlaces: Math.max(
      excursion.maxPeople - excursion.registeredCount,
      0,
    ),
  }
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')

  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: 'Необходим е вход като администратор.' })
    return
  }

  req.admin = sessions.get(token)
  next()
}

app.get('/api/health', async (req, res) => {
  await database.command({ ping: 1 })
  res.json({ status: 'ok', database: 'mongodb' })
})

app.get('/api/excursions', async (req, res) => {
  const filter = req.query.available === 'true'
    ? { $expr: { $lt: ['$registeredCount', '$maxPeople'] } }
    : {}
  const excursions = await excursionsCollection.find(filter).sort({ title: 1 }).toArray()
  res.json(excursions.map(serializeExcursion))
})

app.post('/api/registrations', async (req, res) => {
  const name = String(req.body.name || '').trim()
  const excursionId = String(req.body.excursionId || '')
  const cancellationCode = String(req.body.cancellationCode || uuidv4())

  if (!name || !ObjectId.isValid(excursionId)) {
    res.status(400).json({ error: 'Името и екскурзията са задължителни.' })
    return
  }

  const excursionObjectId = new ObjectId(excursionId)
  const excursion = await excursionsCollection.findOneAndUpdate(
    {
      _id: excursionObjectId,
      $expr: { $lt: ['$registeredCount', '$maxPeople'] },
    },
    { $inc: { registeredCount: 1 } },
    { returnDocument: 'after' },
  )

  if (!excursion) {
    res.status(409).json({ error: 'За тази екскурзия няма свободни места.' })
    return
  }

  try {
    const registration = {
      name,
      excursionId: excursionObjectId,
      excursionTitle: excursion.title,
      cancellationCode,
      createdAt: new Date(),
    }
    const result = await registrationsCollection.insertOne(registration)

    res.status(201).json({
      id: result.insertedId.toString(),
      ...registration,
      excursionId,
      cancellationCode,
    })
  } catch (error) {
    await excursionsCollection.updateOne(
      { _id: excursionObjectId, registeredCount: { $gt: 0 } },
      { $inc: { registeredCount: -1 } },
    )

    if (error.code === 11000) {
      res.status(409).json({ error: 'Кодът за отказ вече съществува.' })
      return
    }
    throw error
  }
})

app.delete('/api/registrations/:cancellationCode', async (req, res) => {
  const registration = await registrationsCollection.findOneAndDelete({
    cancellationCode: req.params.cancellationCode,
  })

  if (!registration) {
    res.status(404).json({ error: 'Не е намерена регистрация с този код.' })
    return
  }

  await excursionsCollection.updateOne(
    { _id: registration.excursionId, registeredCount: { $gt: 0 } },
    { $inc: { registeredCount: -1 } },
  )

  res.json({ message: 'Регистрацията е отказана успешно.' })
})

app.get('/api/users', async (req, res) => {
  const userName = String(req.query.userName || '')
  const password = String(req.query.password || '')
  const user = await usersCollection.findOne({ userName, password })

  if (!user) {
    res.json([])
    return
  }

  const token = uuidv4()
  const session = { id: user._id.toString(), userName: user.userName, token }
  sessions.set(token, session)
  res.json([session])
})

app.get('/api/registrations', requireAdmin, async (req, res) => {
  const excursionId = String(req.query.excursionId || '')

  if (!ObjectId.isValid(excursionId)) {
    res.status(400).json({ error: 'Изберете валидна екскурзия.' })
    return
  }

  const registrations = await registrationsCollection
    .find({ excursionId: new ObjectId(excursionId) })
    .sort({ createdAt: 1 })
    .toArray()

  res.json(
    registrations.map((registration) => ({
      id: registration._id.toString(),
      name: registration.name,
      excursionId: registration.excursionId.toString(),
      excursionTitle: registration.excursionTitle,
      cancellationCode: registration.cancellationCode,
      createdAt: registration.createdAt,
    })),
  )
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Възникна грешка в сървъра.' })
})

app.listen(port, () => {
  console.log(`Excursions API: http://localhost:${port}/api`)
})
