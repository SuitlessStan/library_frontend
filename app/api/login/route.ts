import { NextResponse, NextRequest } from "next/server"
import { signIn } from "@/firebase/auth/user"

export async function POST(request: NextRequest, response: NextResponse) {
  const formData = await request.formData()

  const emailValue = formData.get("email")
  const passwordValue = formData.get("password")

  if (!emailValue || !passwordValue) {
    return NextResponse.json({ message: "please fill all required fields!" }, { status: 400 })
  }

  const { result, error } = await signIn(emailValue as string, passwordValue as string)
  if (result) {
    return NextResponse.json({ message: "signing in.." }, { status: 200 })
  }
  return NextResponse.json({ message: error }, { status: 400 })
}
