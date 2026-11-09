import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: `${process.env.FIRESTORE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIRESTORE_PROJECT_ID,
  storageBucket: `${process.env.FIRESTORE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.FIRESTORE_MESSAGE_SENDER_ID,
  appId: process.env.FIRESTORE_APP_ID,
}

export const hasFirestoreConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.projectId,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
].every((value) => value && !value.startsWith('replace_with_'))

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
