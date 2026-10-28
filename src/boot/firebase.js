import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCMUKBneZbH3r-AGpWidbinTh_YhlWmQII',
  authDomain: 'pokestore-a16a4.firebaseapp.com',
  projectId: 'pokestore-a16a4',
  storageBucket: 'pokestore-a16a4.firebasestorage.app',
  messagingSenderId: '531999897358',
  appId: '1:531999897358:web:5ae870f4e3e94f8d09495f',
  measurementId: 'G-QS2QNVV26Z',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage }
