import { NextResponse, NextRequest } from "next/server"
import { sendEmailVerification } from "firebase/auth"
import { signUp } from "@/firebase/auth/user"

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

  const { result, error } = await signUp(emailValue as string, passwordValue as string)
  if (result) {
    await sendEmailVerification(result.user)
    return NextResponse.json(
      { message: "New user has been successfully created!" },
      { status: 200 }
    )
  }
  return NextResponse.json({ message: error }, { status: 400 })
}
