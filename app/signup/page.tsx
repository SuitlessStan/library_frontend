"use client"
import { useState, useRef, useEffect } from "react"
import axios, { AxiosError } from "axios"
import Link from "next/link"
import Cookies from "js-cookie"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"

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

  const [formDataError, setFormDataError] = useState({
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  })

  const router = useRouter()

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      redirect("/signup/settings")
    }
  }, [])

  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [error, setError] = useState("")

  const ref = useRef(null)

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
    scrollToTop()
    setLoading(true)

    const { email, password, confirmPassword } = formData

    const emailError = validateEmail(email) ? "" : "Invalid Email format"
    const passwordError = validatePassword(password)
      ? ""
      : "Password should be longer than 6 characters!"

    setFormDataError({
      emailError,
      passwordError,
      confirmPasswordError: password !== confirmPassword ? "Passwords do not match" : "",
    })

    if (emailError || passwordError || password !== confirmPassword) {
      setLoading(false)
      return
    }

    try {
      const data = new FormData(e.currentTarget)
      await axios.post("/api/signup", data)
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      setTimeout(() => router.push("/signup/settings"), 2000)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError
        let errorMessage = "Something went wrong while sending the request"

        if (axiosError.response) {
          const responseData = axiosError.response.data
          if (responseData.error && responseData.error.code === "auth/email-already-in-use") {
            errorMessage = "Email is already in use. Please use a different email address."
          } else if (responseData.message) {
            errorMessage = responseData.message
          }
        }

        console.error(axiosError)
        setError(errorMessage)
        setTimeout(() => setError(""), 3000)
      } else {
        console.error("An unknown error occurred:", err)
      }
    }
    setLoading(false)
  }

  const { email, password, confirmPassword } = formData
  const { emailError, passwordError, confirmPasswordError } = formDataError

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
            value={email}
            onChange={handleChange}
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
            className={`w-full border-4 rounded text-black  ${
              passwordError ? "border-red-400" : "border-gray-500"
            } p-4`}
          />
          {passwordError && <span className="text-red-400">{passwordError}</span>}
          {confirmPasswordError && <span className="text-red-400">{confirmPasswordError}</span>}
        </div>
        <div className="input my-4 flex flex-col gap-2">
          <label htmlFor="password" className="text-xl">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Password"
            value={confirmPassword}
            onChange={handleChange}
            className={`w-full border-4 rounded text-black ${
              confirmPasswordError ? "border-red-400" : "border-gray-500"
            } p-4`}
          />
          {confirmPasswordError && <span className="text-red-400">{confirmPasswordError}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-3/5 mx-auto border my-5 rounded border-gray-400 bg-gray-600 py-4">
          {loading ? "Signing up..." : "Sign up"}
        </button>

        <span className="ml-1 text-md">
          Already a member ?{" "}
          <Link className="border border-transparent border-b-white pb-1" href="/login">
            Log in
          </Link>
        </span>
      </form>
    </>
  )
}
