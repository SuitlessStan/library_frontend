import { NextResponse, NextRequest } from "next/server"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import initFirebase from "@/firebase/config"

export async function POST(request: NextRequest, response: NextResponse) {
  const formData = await request.formData()

  const emailValue = formData.get("email")
  const passwordValue = formData.get("password")
  const confirmPasswordValue = formData.get("confirmPassword")

  if (passwordValue != confirmPasswordValue) {
    return NextResponse.json({ message: "Passwords do not match" }, { status: 400 })
  }

  if (!emailValue || !passwordValue) {
    return NextResponse.json({ message: "please fill all required fields!" }, { status: 400 })
  }

  try {
    initFirebase()
    const userCredentials = await createUserWithEmailAndPassword(
      getAuth(),
      emailValue as string,
      passwordValue as string
    )
    if (userCredentials) {
      await sendEmailVerification(userCredentials.user)
    }
    return NextResponse.json(
      { message: "New user has been successfully created!" },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err }, { status: 400 })
  }
}
