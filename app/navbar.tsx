"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "firebase/auth"
import { auth, db } from "@/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { DocumentData, collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpWideShort, faArrowUpZA } from "@fortawesome/free-solid-svg-icons"

export default function Navbar({
  setModalStatus,
}: {
  setModalStatus: React.Dispatch<React.SetStateAction<{ showForm: boolean; showOverlay: boolean }>>
}) {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const [mode, setMode] = useState<string>()
  const [userData, setUserData] = useState<DocumentData | null>(null)
  const dropDownRef = useRef(null)

  const [user] = useAuthState(auth)

  const handleLinkClick = () => {
    setOpen(false)
  }

  const logout = () => {
    signOut(auth)
  }

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    setMode(prefersDarkMode ? "dark" : "light")

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) => {
      const colorScheme = event.matches ? "dark" : "light"
      setMode(colorScheme)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setShown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  useEffect(() => {
    async function getLatestUserData() {
      try {
        const usersCollection = collection(db, "users")
        const userQuery = query(
          usersCollection,
          where("uid", "==", user?.uid),
          orderBy("timestamp", "desc"),
          limit(1)
        )
        const querySnapshot = await getDocs(userQuery)
        if (!querySnapshot.empty) {
          setUserData(querySnapshot.docs[0].data())
        }
        console.log(userData)
      } catch (err) {
        console.error("Error fetching user settings:", err)
      }
    }

    getLatestUserData()
  }, [user])

  const renderAuthLinks = () => {
    if (user) {
      return (
        <div className="max-w-screen-xl flex justify-between items-center gap-2 mx-auto p-4">
          <div id="bookButtons" className="flex gap-3">
            <button
              className="border px-2 py-2 rounded"
              onClick={(e) =>
                setModalStatus((prevModalStatus) => ({
                  showForm: !prevModalStatus.showForm,
                  showOverlay: !prevModalStatus.showOverlay,
                }))
              }>
              Add new book
            </button>
            <button>
              <FontAwesomeIcon icon={faArrowUpWideShort} size="lg" />
            </button>
            <button>
              <FontAwesomeIcon icon={faArrowUpZA} size="lg" />
            </button>
          </div>
          <div id="userProfile" className="flex flex-col items-center md:order-2">
            <button
              type="button"
              className="mr-3 flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:mr-0"
              id="user-menu-button"
              aria-expanded={shown}
              ref={dropDownRef}
              onClick={(e) => setShown(!shown)}
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom">
              <span className="sr-only">Open user menu</span>
              <Image
                className="h-8 w-8 rounded-full"
                src={userData?.profilePictureURL ? userData?.profilePictureURL : ""}
                alt="user photo"
                width={100}
                height={100}
              />
            </button>
            <div
              ref={dropDownRef}
              className={`z-50 my-4 ${
                shown ? "block" : "hidden"
              } absolute top-14 right-0 md:right-14 xl:right-64 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700`}
              id="user-dropdown">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {userData?.name ? userData?.name : "User"}
                </span>
                <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <Link
                    href="/signup/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/logout"
                    onClick={logout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return (
      <>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex absolute top-0 right-0 p-1 text-sm h-8 w-8 rounded-lg md:hidden"
          aria-controls="navbar-default"
          aria-expanded={open}>
          {!open && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 6H20M4 12H20M13 18H20"
                stroke={`${mode === "dark" ? "white" : "black"}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {open && (
            <svg
              width="22"
              height="24"
              viewBox="0 0 22 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 6.12305L17 18.123L14.5 15.623L12 13.123M5 18.123L17 5.87695"
                stroke={`${mode === "dark" ? "white" : "black"}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <div
          className={`${open ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="default-navbar">
          <ul className="font-medium flex flex-col md:flex-row md:py-4 md:mx-4 mt-5 rounded-lg text-center md:space-x-8 md:mt-0 border-gray-700">
            {!user && (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={handleLinkClick}
                    className="block py-2 pl-3 pr-4 md:p-0 rounded text-sm md:text-lg border-b-4 border-transparent hover:border-white transition-colors font-Roboto">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    onClick={handleLinkClick}
                    className="block py-2 pl-3 pr-4 md:p-0 rounded text-sm md:text-lg border-b-4 border-transparent hover:border-white transition-colors font-Roboto">
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </>
    )
  }

  return (
    <nav className="dark:bg-black bg-white fixed w-full z-10 top-0 opacity-75">
      {renderAuthLinks()}
    </nav>
  )
}
