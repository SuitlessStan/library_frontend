"use client"
import { useState, useRef } from "react"
import axios from "axios"
import Link from "next/link"

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return email.trim() ? emailRegex.test(email) : false
}

const validatePassword = (password: string) => {
  return password.trim() && password.length >= 6
}

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [error, setError] = useState("")

  const ref = useRef(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | undefined>) => {
    e.preventDefault()
    scrollToTop()
    setLoading(true)

    const { email, password, confirmPassword } = formData

    if (!validateEmail(email)) {
      setError("Invalid email format.")
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setError("Password should be at least 6 characters long.")
      setLoading(false)
      return
    }

    if (password != confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const data = new FormData(e.currentTarget)
      await axios.post("/api/signup", data)
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 7000)
    } catch (err) {
      console.error(err)
      setError("Something went wrong while sending the message")
      setTimeout(() => setError(""), 5000)
    }
    setLoading(false)

    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
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
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert">
              <strong className="font-bold block">Oh no!</strong>
              <span className="block sm:inline">{error}</span>
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
            value={formData.email}
            onChange={handleChange}
            className={`w-full border-4 rounded text-black ${
              error && !validateEmail(formData.email) ? "border-red-400" : "border-gray-500"
            } p-4`}
          />
        </div>
        <div className="input my-4 flex flex-col gap-2">
          <label htmlFor="password" className="text-xl">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border-4 rounded text-black ${
              error && !validatePassword(formData.password) ? "border-red-400" : "border-gray-500"
            } p-4`}
          />
        </div>
        <div className="input my-4 flex flex-col gap-2">
          <label htmlFor="password" className="text-xl">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full border-4 rounded text-black ${
              error && formData.password !== formData.confirmPassword
                ? "border-red-400"
                : "border-gray-500"
            } p-4`}
          />
        </div>

        <button
          type="submit"
          className="w-3/5 mx-auto border my-5 rounded border-gray-400 bg-gray-600 py-4">
          Sign up
        </button>

        <span className="ml-1 text-md">
          Already a member ?{" "}
          <Link className="border border-transparent border-b-white" href="/login">
            Log in
          </Link>
        </span>
      </form>
    </>
  )
}
