"use client"

import Link from "next/link"
import CyclingBackground from "@/components/cyclingBackground/cyclingBackground"
import Navbar from "./navbar"
import { useAuthState } from "react-firebase-hooks/auth"
import firebaseApp from "@/firebase/config"
import { getAuth } from "firebase/auth"

const auth = getAuth(firebaseApp)

export default function Home() {
  const [user, error] = useAuthState(auth)

  const renderAuthLinks = () => {
    if (!user) {
      return (
        <div className="flex flex-col justify-center items-center px-4 z-10 relative top-60 text-center">
          <h1 className="text-4xl mt-10 font-Roboto">Virtual Library</h1>
          <span className="text-2xl font-Roboto shadow-sm mb-5 italic">
            Start your own personal experience!
          </span>
          <Link
            href="/signup"
            className="px-2 py-1 my-2 border rounded bg-white text-black text-md opacity-90">
            Join now!
          </Link>
          <Link
            href="/login"
            className="px-2 py-1 border rounded bg-white text-black text-md opacity-90">
            Already a member
          </Link>
        </div>
      )
    }
  }

  return (
    <>
      <CyclingBackground />
      <Navbar />
      {renderAuthLinks()}
    </>
  )
}
