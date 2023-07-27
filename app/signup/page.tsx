"use client"

import { useState } from "react"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setEmailError("Email is required.")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.")
      return false
    } else {
      setEmailError("")
      return true
    }
  }

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      setPasswordError("Password is required.")
      return false
    } else if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters.")
      return false
    } else {
      setPasswordError("")
      return true
    }
  }

  return (
    <>
      <form
        className="my-40 border rounded flex flex-col mx-auto p-5 w-full md:w-2/5"
        action="/signup"
        method="POST">
        <span className="text-4xl my-4 block">Sign up</span>
        <div className="input my-4 flex flex-col gap-2">
          <label htmlFor="email" className="text-xl">
            Email
          </label>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              validateEmail(e.target.value)
            }}
            className={`w-full border-4 rounded text-black ${
              emailError ? "border-red-400" : "border-gray-500"
            } p-4`}
          />
          {emailError && <span className="text-red-400">{emailError}</span>}
        </div>
        <div className="input my-4 flex flex-col gap-2">
          <label htmlFor="password" className="text-xl">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              validatePassword(e.target.value)
            }}
            className={`w-full border-4 rounded text-black ${
              passwordError ? "border-red-400" : "border-gray-500"
            } p-4`}
          />
          {passwordError && <span className="text-red-400">{passwordError}</span>}
        </div>
        <button
          type="submit"
          className="w-full border my-5 rounded border-gray-400 bg-gray-600 py-4">
          Sign up
        </button>
      </form>
    </>
  )
}
