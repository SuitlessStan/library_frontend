import { getApps } from "firebase/app"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import config from "../config.json"
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth"

const firebaseApp = getApps().length === 0 ? firebase.initializeApp(config) : getApps()[0]

export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
export const auth = getAuth(firebaseApp)

setPersistence(auth, browserSessionPersistence).catch((err) =>
  console.error("Error setting auth persistence ", err)
)

export default firebaseApp
