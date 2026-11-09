import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/excursions'

export async function getSingleUser() {
  const client = new MongoClient(uri)

  try {
    const database = client.db('excursions')
    const users = database.collection('users')
    return await users
      .find({ points: 100 })
      .project({ password: false })
      .toArray()
  } finally {
    await client.close()
  }
}

export async function test() {
  const client = new MongoClient(uri)

  try {
    const database = client.db('excursions')
    const users = database.collection('users')

    return await users
      .find({
        points: {
          $gte: 5,
          $lt: 110,
        },
      })
      .project({ password: false, email: false })
      .sort({ points: 1, age: -1 })
      .toArray()
  } finally {
    await client.close()
  }
}
