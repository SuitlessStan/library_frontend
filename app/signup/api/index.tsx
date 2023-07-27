import { NextResponse, NextRequest } from "next/server"

export default async function POST(request: NextRequest, response: NextResponse) {
  const formData = await request.formData()

  const emailValue = formData.get("email")
  const passwordValue = formData.get("password")

  if (!emailValue || !passwordValue) {
    return NextResponse.json({ message: "please fill all required fields!" }, { status: 400 })
  }
}
