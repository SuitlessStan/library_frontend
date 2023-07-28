import { NextResponse, NextRequest } from "next/server"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import initFirebase from "@/firebase/config"

export async function POST(request: NextRequest, response: NextResponse) {
  const formData = await request.formData()

  const emailValue = formData.get("email")
  const passwordValue = formData.get("password")

  if (!emailValue || !passwordValue) {
    return NextResponse.json({ message: "please fill all required fields!" }, { status: 400 })
  }

  try {
    initFirebase()
    const auth = getAuth()
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      emailValue as string,
      passwordValue as string
    )
    if (userCredentials) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err }, { status: 400 })
  }
}
