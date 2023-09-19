import { getApps } from "firebase/app"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const config = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
  measurementId: process.env.NEXT_PUBLIC_measurementId,
}

const firebaseApp = getApps().length === 0 ? firebase.initializeApp(config) : getApps()[0]

export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
export const auth = getAuth(firebaseApp)

export default firebaseApp
