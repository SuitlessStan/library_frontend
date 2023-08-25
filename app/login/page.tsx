"use client"
import { useRouter } from "next/navigation"

import { useState, useRef } from "react"
import Link from "next/link"
import { scrollToTop } from "@/utils/helpers"
import { validateEmail, validatePassword } from "@/utils/validator"
import { signIn } from "@/firebase/auth/user"
import { auth } from "@/firebase/config"
import { browserLocalPersistence, setPersistence } from "firebase/auth"

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    const newValue = type == "checkbox" ? checked : value

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | undefined>) => {
    e.preventDefault()
    setLoading(true)
    scrollToTop()

    const { email, password, rememberMe } = formData

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

      const { result, error } = response
      if (result && rememberMe) {
        await setPersistence(auth, browserLocalPersistence)
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 2000)
        return router.push("/")
      }
      if (result) {
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 2000)
        return router.push("/")
      }
      if (error) {
        if (error.message == "Firebase: Error (auth/user-not-found).") {
          setError(`User with entered information doesn't exist`)
          setTimeout(() => setError(""), 3000)
        }
        if (error.message == "Firebase: Error (auth/wrong-password).") {
          setError("Invalid email or password")
          setTimeout(() => setError(""), 3000)
        }
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
      rememberMe: false,
    })
  }

  const { email, password, rememberMe } = formData
  const { emailError, passwordError } = formDataError

  return (
    <>
      <form
        className="my-40 border rounded flex flex-col mx-auto p-5 w-full md:w-2/6"
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
        <div className="input my-4 px-4 flex gap-2 items-center">
          <label htmlFor="Remeber me" className="text-xl">
            Remeber me
          </label>
          <input
            type="checkbox"
            name="rememberMe"
            className="w-4 h-4"
            checked={rememberMe}
            onChange={handleChange}
          />
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
