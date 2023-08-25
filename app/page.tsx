"use client"

import { useState } from "react"
import Link from "next/link"
import CyclingBackground from "@/components/cyclingBackground/cyclingBackground"
import Navbar from "./navbar"
import { useAuthState } from "react-firebase-hooks/auth"
import firebaseApp from "@/firebase/config"
import { getAuth } from "firebase/auth"

const auth = getAuth(firebaseApp)

type Book = {
  title: string
  id?: string
  createAt?: string | Date
  updatedAt?: string | Date
  inactiveAt?: string | Date
  fbUserId: string
  current_page: number | null
  total_pages: number | null | undefined
  author: string
  cover_url: string
  review: string
}

export default function Home() {
  const [user, error] = useAuthState(auth)
  const [books, setBooks] = useState<Book[]>([])
  const [modalStatus, setModalStatus] = useState({
    showForm: false,
    showOverlay: false,
  })

  const [formData, setFormData] = useState({
    title: "",
    fbUserId: user?.uid,
    current_page: 0,
    total_pages: null,
    review: "",
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const { title, fbUserId, current_page, total_pages, review } = formData
  const { showForm, showOverlay } = modalStatus

  return (
    <>
      <CyclingBackground />
      <Navbar setModalStatus={setModalStatus} />
      {showForm && (
        <div>
          {/* Main modal */}
          <div
            id="bookModal"
            tabIndex={-1}
            aria-hidden={showForm}
            className={`${
              showForm ? "block" : "hidden"
            } z-50 p-4 w-full md:w-1/3 overflow-x-hidden overflow-y-auto`}>
            <div className="relative ">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header  */}
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add a new book
                  </h3>
                  <button
                    type="button"
                    onClick={(e) =>
                      setModalStatus((prevModalStatus) => ({
                        showForm: !prevModalStatus.showForm,
                        showOverlay: !prevModalStatus.showOverlay,
                      }))
                    }
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="bookModal">
                    <svg
                      className="w-3 h-3"
                      aria-hidden={showForm}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/*  Modal body  */}
                <div className="p-6 space-y-6">
                  <form action="">
                    <div className="input flex flex-col my-3 gap-1">
                      <label htmlFor="title" className="text-md">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Book title"
                        name="title"
                        value={title}
                        onChange={handleChange}
                        required
                        className={`w-full border-4 rounded text-black border-gray-500 p-3`}
                      />
                    </div>
                    <div className="input flex flex-col my-3 gap-1">
                      <label htmlFor="current_page" className="text-md">
                        Current page
                      </label>
                      <input
                        type="number"
                        placeholder="Current page"
                        name="current_page"
                        value={current_page}
                        onChange={handleChange}
                        required
                        className={`w-full border-4 rounded text-black border-gray-500 p-3`}
                      />
                    </div>
                    <div className="input flex flex-col my-3 gap-1">
                      <label htmlFor="total_pages" className="text-md">
                        Pages count
                      </label>
                      <input
                        type="number"
                        placeholder="Current page"
                        name="total_pages"
                        value={total_pages ? total_pages : 1000}
                        onChange={handleChange}
                        required
                        className={`w-full border-4 rounded text-black border-gray-500 p-3`}
                      />
                    </div>
                    <div className="input flex flex-col my-3 gap-1">
                      <label htmlFor="review" className="text-md">
                        Review
                      </label>
                      <textarea
                        placeholder="Review"
                        name="review"
                        value={review}
                        onChange={handleChange}
                        className="w-full border-4 rounded text-black border-gray-500 p-3"
                        style={{ height: "10rem", resize: "none" }}></textarea>
                    </div>
                  </form>
                </div>
                {/* Modal footer  */}
                <div className="flex justify-center items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    data-modal-hide="bookModal"
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Add
                  </button>
                  <button
                    data-modal-hide="bookModal"
                    type="button"
                    onClick={(e) =>
                      setModalStatus((prevModalStatus) => ({
                        showForm: false,
                        showOverlay: false,
                      }))
                    }
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showOverlay && <div className="overlay"></div>}

      {renderAuthLinks()}
    </>
  )
}
