"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Cookies from "js-cookie"
import { redirect } from "next/navigation"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<string>()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLinkClick = () => {
    setOpen(false)
  }

  const handleLogOut = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    Cookies.remove("accessToken")
    redirect("/logout")
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

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
    }

    if (Cookies.get("accessToken")) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <nav className="dark:bg-black bg-white fixed w-full z-10 top-0 opacity-75">
      <div className="max-w-screen-xl flex flex-wrap justify-end gap-2 mx-auto p-4">
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          onClick={() => {
            setOpen(!open)
          }}
          className="inline-flex items-center justify-center text-sm h-8 w-8 rounded-lg md:hidden"
          aria-controls="navbar-default"
          aria-expanded={open ? "true" : "false"}>
          <span className="sr-only">Open main menu</span>
          {!open ? (
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
          ) : (
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
          <ul className="font-medium flex flex-col md:flex-row mt-5 rounded-lg text-center md:space-x-8 md:mt-0 border-gray-700">
            {!isLoggedIn && (
              <>
                {" "}
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
            {isLoggedIn && (
              <li>
                <Link
                  href="/logout"
                  onClick={(e) => {
                    handleLinkClick()
                    handleLogOut(e)
                  }}
                  className="block py-2 pl-3 pr-4 md:p-0 rounded text-sm md:text-lg border-b-4 border-transparent hover:border-white transition-colors font-Roboto">
                  logout
                </Link>
              </li>
            )}
          </ul>
        </div>

        {isLoggedIn && (
          <div className="flex items-center md:order-2">
            <button
              type="button"
              className="mr-3 flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:mr-0"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src="/docs/images/people/profile-picture-3.jpg"
                alt="user photo"
              />
            </button>
            <div
              className="z-50 my-4 hidden list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
              id="user-dropdown">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                  name@flowbite.com
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                    Earnings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
