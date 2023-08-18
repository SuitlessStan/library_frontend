import { getApps } from "firebase/app"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import config from "../config.json"

const firebaseApp = getApps().length === 0 ? firebase.initializeApp(config) : getApps()[0]

export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)

export default firebaseApp
