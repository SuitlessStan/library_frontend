"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"
import Cookies from "js-cookie"

export default function Logout() {
  useEffect(() => {
    if (!Cookies.get("accessToken")) {
      setTimeout(() => redirect("/"), 2000)
    }
  }, [])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md px-8 py-6 bg-white shadow-md rounded-md">
        <h2 className="text-3xl font-semibold mb-4">Logging out...</h2>
        <p className="text-gray-600">You are being logged out.</p>
      </div>
    </div>
  )
}
