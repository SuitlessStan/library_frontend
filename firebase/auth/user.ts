import firebaseApp from "../config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth"

const auth = getAuth(firebaseApp)

export async function signUp(email: string, password: string) {
  let result,
    error = null

  try {
    result = await createUserWithEmailAndPassword(auth, email, password)
  } catch (err) {
    error = err
  }
  return { result, error }
}

export async function signIn(email: string, password: string) {
  let result,
    error = null

  try {
    result = await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    error = err
  }
  return { result, error }
}
