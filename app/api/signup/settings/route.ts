import { NextResponse, NextRequest } from "next/server"
import { getAuth } from "firebase/auth"
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import initFirebase from "@/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"

initFirebase()
const db = firebase.firestore()

export async function POST(request: NextRequest, response: NextResponse) {
  const formData = await request.formData()

  const name = formData.get("name")

  const formDataObject: { [key: string]: FormDataEntryValue | null } = {}

  for (const [key, value] of formData.entries()) {
    formDataObject[key] = value
  }

  if (!name) {
    return NextResponse.json({ message: "Please fill your name field!" }, { status: 400 })
  }

  try {
    delete formDataObject.profilePicture
    await db.collection("users").add(formDataObject)
    return NextResponse.json({ message: formDataObject }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err }, { status: 400 })
  }
}
