"use client"

import { useState, useRef } from "react"
import axios from "axios"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showError, setShowError] = useState(false)

  const ref = useRef(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | undefined>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData(e.currentTarget)
      await axios.post("/api/signup", data)
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    } catch (err) {
      console.error(err)
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
    }
    setLoading(false)
    setEmail("")
    setPassword("")
    scrollToTop()
  }

  return (
    <>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className="my-40 border rounded flex flex-col mx-auto p-5 w-full md:w-2/5"
        action="/api/signup"
        method="POST">
        <span className="text-4xl my-4 block">Sign up</span>
        <div className="message-progress">
          {loading && <div className="circular-progress"></div>}
          {showAlert && (
            <div
              className="bg-blue-100 border-t border-b border-green-500 text-green-700 px-4 py-3"
              role="alert">
              <p className="font-bold">New User Created!</p>
              <p className="text-sm">Please check your email to verify your account!</p>
            </div>
          )}
          {showError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert">
              <strong className="font-bold block">Oh no!</strong>
              <span className="block sm:inline">
                Something went wrong while sending the message
              </span>
            </div>
          )}
        </div>
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
