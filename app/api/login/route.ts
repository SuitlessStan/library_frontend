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

  // try {
  initFirebase()

  const userCredentials = await signInWithEmailAndPassword(
    getAuth(),
    emailValue as string,
    passwordValue as string
  )

  if (userCredentials) {
    return NextResponse.json({ accessToken: await userCredentials.user.getIdToken() })
  }

  return NextResponse.json({ message: "Something went wrong!" }, { status: 400 })
}
