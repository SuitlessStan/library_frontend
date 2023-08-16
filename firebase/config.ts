import { getApps } from "firebase/app"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket: process.env.storageBucket,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
//   measurementId: process.env.measurementId,
// }

const firebaseConfig = {
  apiKey: "AIzaSyAOoyLN7--SOtmPUks6yL_0U-HZqRXagdc",
  authDomain: "virual-library.firebaseapp.com",
  projectId: "virual-library",
  storageBucket: "virual-library.appspot.com",
  messagingSenderId: "906908966595",
  appId: "1:906908966595:web:0d2ef7814a1adce46d4c76",
  measurementId: "G-5G2MVRVE8T",
}

const firebaseApp = getApps().length === 0 ? firebase.initializeApp(firebaseConfig) : getApps()[0]

export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)

export default firebaseApp
