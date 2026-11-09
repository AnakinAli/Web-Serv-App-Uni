import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  age: Number,
  points: { type: Number, default: 0 },
  dateAdded: { type: Date, default: Date.now },
  admin: { type: Boolean, default: false },
})

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  image: String,
  stock: { type: Number, default: 0, min: 0 },
  dateAdded: { type: Date, default: Date.now },
})

const excursionSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  price: { type: Number, required: true, min: 0 },
  maxPeople: { type: Number, default: 20, min: 1 },
  registeredCount: { type: Number, default: 0, min: 0 },
  dateAdded: { type: Date, default: Date.now },
})

export const User = mongoose.model('User', userSchema, 'users')
export const Product = mongoose.model('Product', productSchema, 'products')
export const Excursion = mongoose.model(
  'Excursion',
  excursionSchema,
  'excursions',
)

export async function connectMongoose() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/excursions'
  await mongoose.connect(uri)
  console.log('Mongoose connected to MongoDB')
}

export async function seedDatabase() {
  if ((await User.countDocuments()) === 0) {
    await User.insertMany([
      {
        username: 'admin',
        password: 'pass',
        email: 'admin@example.com',
        age: 30,
        points: 100,
        admin: true,
      },
      {
        username: 'niki',
        password: '1234',
        email: 'niki@example.com',
        age: 22,
        points: 75,
        admin: false,
      },
      {
        username: 'viki',
        password: '5678',
        email: 'viki@example.com',
        age: 21,
        points: 15,
        admin: false,
      },
    ])
  }

  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany([
      {
        name: 'Туристическа раница',
        description: 'Удобна раница за еднодневни преходи.',
        price: 79.9,
        image: '/images/backpack.svg',
        stock: 12,
      },
      {
        name: 'Термос',
        description: 'Метален термос с вместимост 750 ml.',
        price: 34.5,
        image: '/images/thermos.svg',
        stock: 20,
      },
      {
        name: 'Планинска карта',
        description: 'Подробна туристическа карта на Рила.',
        price: 12,
        image: '/images/map.svg',
        stock: 35,
      },
    ])
  }

  if ((await Excursion.countDocuments()) === 0) {
    await Excursion.insertMany([
      {
        title: 'Рилските езера',
        description: 'Еднодневен планински преход.',
        image: '/images/rila.svg',
        price: 55,
        maxPeople: 18,
        registeredCount: 4,
      },
      {
        title: 'Старият Пловдив',
        description: 'Историческа разходка из Стария град.',
        image: '/images/plovdiv.svg',
        price: 42,
        maxPeople: 25,
        registeredCount: 9,
      },
      {
        title: 'Белоградчишките скали',
        description: 'Природен феномен и крепостта Калето.',
        image: '/images/belogradchik.svg',
        price: 68,
        maxPeople: 20,
        registeredCount: 6,
      },
    ])
  }
}
