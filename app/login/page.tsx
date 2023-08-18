"use client"
import { useRouter } from "next/navigation"

import { useState, useRef } from "react"
import Link from "next/link"
import { validateEmail, validatePassword } from "@/utils/validator"
import { signIn } from "@/firebase/auth/user"

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [formDataError, setFormDataError] = useState({
    emailError: "",
    passwordError: "",
  })

  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [error, setError] = useState("")

  const ref = useRef(null)
  const router = useRouter()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | undefined>) => {
    e.preventDefault()
    setLoading(true)
    scrollToTop()

    const { email, password } = formData

    const emailError = !validateEmail(email) ? "Invalid email format" : ""
    const passwordError = !validatePassword(password)
      ? "Password should be at least 6 characters long"
      : ""

    setFormDataError({
      emailError,
      passwordError,
    })

    if (emailError || passwordError) {
      setLoading(false)
      return
    }

    try {
      const response = await signIn(formData.email, formData.password)

      if (response.result) {
        setTimeout(() => setShowAlert(true), 3000)
        router.push("/")
      }
    } catch (err) {
      console.error(err)
      setError("Something wrong happened while sending the request")
      setTimeout(() => setError(""), 3000)
    }
    setLoading(false)

    setFormData({
      email: "",
      password: "",
    })
  }

  const { email, password } = formData
  const { emailError, passwordError } = formDataError

  return (
    <>
      <form
        className="my-40 border rounded flex flex-col mx-auto p-5 w-full md:w-2/5"
        action="/api/login"
        onSubmit={handleSubmit}
        ref={ref}
        method="POST">
        <span className="text-4xl my-4 block">Sign in</span>

        <div className="message-progress">
          {loading && <div className="circular-progress"></div>}
          {showAlert && (
            <div
              className="bg-blue-100 border-t border-b border-green-500 text-green-700 px-4 py-3"
              role="alert">
              <p className="font-bold">Login successful</p>
              <p className="text-sm">You may now enter your library!</p>
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
            value={email}
            onChange={handleChange}
            required
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
            onChange={handleChange}
            required
            className={`w-full border-4 rounded text-black ${
              passwordError ? "border-red-400" : "border-gray-500"
            } p-4`}
          />
          {passwordError && <span className="text-red-400">{passwordError}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-3/5 mx-auto border my-5 rounded border-gray-400 bg-gray-600 py-4">
          {loading ? "Logging in..." : "Login"}
        </button>

        <span className="ml-1 text-md">
          Not a member ?{" "}
          <Link className="border border-transparent border-b-white pb-1" href="/signup">
            Sign up
          </Link>
        </span>
      </form>
    </>
  )
}
