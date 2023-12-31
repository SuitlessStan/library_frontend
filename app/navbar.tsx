"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "firebase/auth"
import { auth, db } from "@/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { DocumentData, collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowUpWideShort,
  faArrowUpZA,
  faMagnifyingGlass,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons"
import { If, Else, Then } from "react-if"
import { useDarkMode } from "usehooks-ts"
import { Book } from "@/utils/types"
import Tooltip from "@/components/Tooltip/Tooltip"

export default function Navbar({
  setModalStatus,
  setFilteredBooks,
  setBooks,
  books,
}: {
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>
  setFilteredBooks: React.Dispatch<React.SetStateAction<Book[]>>
  setModalStatus: React.Dispatch<React.SetStateAction<boolean>>
  books: Book[]
}) {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const [userData, setUserData] = useState<DocumentData | null>(null)
  const [searchBar, setSearchBar] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  const dropDownRef = useRef(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const { isDarkMode } = useDarkMode()

  const [user] = useAuthState(auth)

  const logOut = async () => await signOut(auth)

  const hideNavbar = () => setShown(false)

  const toggleSearchBar = () => {
    if (!searchBar) {
      setSearchBar((prevState) => !prevState)
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }
    if (searchBar) {
      setSearchBar((prevState) => !prevState)
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
      setSearchInput("")
      setFilteredBooks([])
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const inputValue = e.target.value
    setSearchInput(inputValue)

    if (!searchInput.length) {
      setFilteredBooks([])
    }
    if (searchInput.length > 0) {
      const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(inputValue.toLowerCase())
      )
      if (!filteredBooks.length) {
        setFilteredBooks([])
      }

      if (filteredBooks.length) {
        setFilteredBooks(filteredBooks)
      }
    }
  }

  const filterBooksbyDate = () => {
    const filteredBooks = books.filter((book) => book.createAt || book.updatedAt)

    const sortedBooks = filteredBooks.sort((a, b) => {
      const aDate = a.createAt || a.updatedAt
      const bDate = b.createAt || b.updatedAt

      if (aDate && bDate) {
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      } else if (aDate) {
        return -1
      } else if (bDate) {
        return 1
      } else {
        return 0
      }
    })

    return sortedBooks
  }

  const filterBooksByTitle = () => {
    const filteredBooks = books.filter((book) => book.title)

    const sortedBooks = filteredBooks.sort((a, b) => {
      const titleA = a.title.toLowerCase()
      const titleB = b.title.toLowerCase()

      if (titleA < titleB) return -1
      if (titleA > titleB) return 1
      return 0
    })

    return sortedBooks
  }

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
      } catch (err) {
        console.error("Error fetching user settings:", err)
      }
    }

    getLatestUserData()
  }, [user])

  const renderAuthLinks = () => {
    if (user) {
      return (
        <div className="flex justify-between items-center gap-2 mx-auto px-10 p-4">
          <div id="bookButtons" className="flex">
            {searchBar ? null : (
              <div className="flex gap-2">
                <button
                  className="border text-sm md:text-md hover:bg-black hover:text-white dark:bg-white dark:text-black bg-black text-white px-2 py-2 rounded"
                  onClick={(e) => setModalStatus((prevModalStatus) => !prevModalStatus)}>
                  Add new book
                </button>
                <Tooltip text="Sort by recently updated">
                  <button>
                    <FontAwesomeIcon
                      aria-label="sortByDate"
                      icon={faArrowUpWideShort}
                      onClick={(e) => setBooks(filterBooksbyDate)}
                      size="lg"
                    />
                  </button>
                </Tooltip>
                <Tooltip text="Sort by title">
                  <button>
                    <FontAwesomeIcon
                      aria-label="sortByTitle"
                      icon={faArrowUpZA}
                      onClick={(e) => setBooks(filterBooksByTitle)}
                      size="lg"
                    />
                  </button>
                </Tooltip>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center" }}>
              {searchBar ? (
                <input
                  type="text"
                  ref={searchInputRef}
                  name="search"
                  placeholder="Search"
                  className={`text-black rounded active:border-none focus:border-none p-2`}
                  style={{ order: 1 }}
                  onChange={handleChange}
                  value={searchInput}
                />
              ) : null}

              {!searchBar && (
                <Tooltip text="Search for book">
                  <button
                    className={`mx-4 relative bottom-2`}
                    onClick={toggleSearchBar}
                    style={{ order: 2 }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                  </button>
                </Tooltip>
              )}

              {searchBar && (
                <Tooltip text="Close">
                  <button
                    className={`mx-4 relative bottom-2`}
                    onClick={toggleSearchBar}
                    style={{ order: 2 }}>
                    <FontAwesomeIcon icon={faCircleXmark} size="lg" />
                  </button>
                </Tooltip>
              )}
            </div>
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
              } absolute top-14 right-0 md:right-14 lg:right-0 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700`}
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
                    onClick={logOut}
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
          data-collapse-toggle="navbar"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex absolute top-4 right-2 h-8 w-8 rounded-lg md:hidden"
          aria-controls="navbar"
          aria-expanded={open}>
          <If condition={open == true}>
            <Then>
              <svg
                width="30"
                height="30"
                viewBox="0 0 22 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 6.12305L17 18.123L14.5 15.623L12 13.123M5 18.123L17 5.87695"
                  stroke={`${isDarkMode ? "white" : "black"}`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Then>
            <Else>
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 6H20M4 12H20M13 18H20"
                  stroke={`${isDarkMode ? "white" : "black"}`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Else>
          </If>
        </button>
        <div className={`${open ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar">
          <ul className="font-medium flex flex-col md:flex-row md:pt-4 md:mx-4 mt-5 rounded-lg text-center md:space-x-8 md:mt-0 border-gray-700">
            <If condition={user == undefined || user == null}>
              <Then>
                <>
                  <li>
                    <Link
                      href="/login"
                      onClick={hideNavbar}
                      className="block py-2 pl-3 pr-4 md:p-0 rounded text-sm md:text-lg border-b-4 border-transparent hover:border-white transition-colors font-Roboto">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      onClick={hideNavbar}
                      className="block py-2 pl-3 pr-4 md:p-0 rounded text-sm md:text-lg border-b-4 border-transparent hover:border-white transition-colors font-Roboto">
                      Sign up
                    </Link>
                  </li>
                </>
              </Then>
            </If>
          </ul>
        </div>
      </>
    )
  }

  return <nav className="dark:bg-black bg-white fixed w-full z-10 top-0">{renderAuthLinks()}</nav>
}
