import { NextResponse, NextRequest } from "next/server"
import { getAuth, signOut } from "firebase/auth"
import firebaseApp from "@/firebase/config"

const auth = getAuth(firebaseApp)

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    await signOut(auth)
    return NextResponse.json({ message: "User signed out successfully" }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { message: "something wrong happened while signing out" },
      { status: 400 }
    )
  }
}
