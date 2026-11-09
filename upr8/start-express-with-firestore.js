import express from 'express'
import cors from 'cors'
import { collection, getDocs } from 'firebase/firestore'
import { db, hasFirestoreConfig } from './firestore.js'

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(express.json())
app.use(cors())

const productsCollectionRef = collection(db, 'products')

async function getProducts(req, res) {
  if (!hasFirestoreConfig) {
    res.status(503).json({
      error: 'Firestore не е конфигуриран.',
      message: 'Заменете placeholder стойностите в .env с параметрите на вашия Firebase проект.',
    })
    return
  }

  try {
    const data = await getDocs(productsCollectionRef)
    const dataArray = data.docs.map((document) => ({
      ...document.data(),
      id: document.id,
    }))

    res.setHeader('Content-Type', 'application/json')
    res.send(dataArray)
  } catch (error) {
    console.error('Firestore request failed:', error)
    res.status(500).json({
      error: 'Данните от Firestore не могат да бъдат заредени.',
      message: error.message,
    })
  }
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    firestoreConfigured: hasFirestoreConfig,
  })
})

app.get('/', getProducts)
app.get('/products', getProducts)

app.listen(port, () => {
  console.log(`Express API: http://localhost:${port}`)
})
