"use client"

import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/firebase/config"

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    async function SignOut() {
      try {
        const response = await axios.post("/api/logout")
        await signOut(auth)
        if (response.status == 200) {
          setTimeout(() => router.push("/"), 2000)
        }
      } catch (err) {
        console.error(err)
      }
    }
    SignOut()
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative bottom-20 md:bottom-0">
      <div className="max-w-md px-8 py-6 bg-white shadow-md rounded-md">
        <h2 className="text-3xl font-semibold mb-4">Logging out...</h2>
        <p className="text-gray-600">You are being logged out.</p>
      </div>
    </div>
  )
}
