"use client"

import { useState, useEffect, useCallback, FormEventHandler, MouseEvent } from "react"
import axios from "axios"
import Link from "next/link"
import CyclingBackground from "@/components/cyclingBackground/cyclingBackground"
import Navbar from "./navbar"
import { useAuthState } from "react-firebase-hooks/auth"
import firebaseApp from "@/firebase/config"
import { getAuth } from "firebase/auth"
import Book from "@/components/book/book"
import Modal from "react-modal"
import moment from "moment"
import Paginate from "@/components/paginate/paginate"
import { getUniqueListBy } from "@/utils/helpers"

const auth = getAuth(firebaseApp)

export default function Home() {
  const [user, error] = useAuthState(auth)
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [booksPerPage] = useState(5)

  const lastBookIndex = currentPage * booksPerPage
  const firstBookIndex = lastBookIndex - booksPerPage
  const currentBooks = books?.slice(firstBookIndex, lastBookIndex)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (currentPage !== Math.ceil(books.length / booksPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const [modalStatus, setModalStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submissionError, setSubmissionError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    fbUserId: user?.uid,
    current_page: 0,
    total_pages: 1000,
    review: "",
  })

  const onEdit = useCallback(
    (id: string | number, params: any[]) => {
      const matchedBooks = books?.map((book) => {
        if (book.id === id) {
          let newBook = { ...book }

          params.forEach((param) => {
            if (param.bookReview) {
              newBook = { ...newBook, review: param.bookReview }
            }
            if (param.currentPage) {
              newBook = { ...newBook, current_page: param.currentPage }
            }
            if (param.totalPages) {
              newBook = { ...newBook, total_pages: param.totalPages }
            }
          })

          newBook.updatedAt = moment().utc().format("YYYY-MM-DD HH:mm:ss")
          return newBook
        }
        return book
      })

      setBooks(matchedBooks)
    },
    [books]
  )

  const fetchUserBooks = async () => {
    try {
      if (!user) return
      const token = await user?.getIdToken(true)
      const requestConfig = {
        headers: {
          authentication: token,
        },
      }
      const response = await axios.get(`api/books/${user?.uid}`, requestConfig)
      if (response.status == 200) {
        for (const book of response.data.result.results) {
          const titleExists = books.some((existingBook) => existingBook.title === book.title)

          if (!titleExists) {
            setBooks((prevBooks) => [...prevBooks, book])
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const submitBooks = async () => {
    const token = await user?.getIdToken(true)
    const headers = {
      authentication: token,
    }
    let data

    const options = {
      method: "POST",
      url: `api/books/${user?.uid}`,
      headers: headers,
      data: data as any,
    }

    try {
      const response = await axios.get(`/api/books/${user?.uid}`, { headers })
      const existingBooks = response.data.result.results

      // Filter out books that are already in the database
      const newBooks = books.filter(
        (book) => !existingBooks.some((existingBook: Book) => existingBook.title === book.title)
      )

      for (const book of newBooks) {
        const { title, current_page, total_pages, review } = book
        const requestBody = {
          title: title,
          current_page: current_page,
          total_pages: total_pages,
          review: review,
        }

        options.data = requestBody

        await axios.request(options)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const closeModal = () => setModalStatus(false)
  const loggedIn = user ? " " : "hidden"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  useEffect(() => {
    fetchUserBooks()
  }, [user])

  useEffect(() => {
    const booksFromStorage = localStorage.getItem("books")
    if (booksFromStorage) {
      setBooks(JSON.parse(booksFromStorage))
    }
  }, [])

  useEffect(() => {
    if (!books?.length) {
      return
    }

    localStorage.setItem("books", JSON.stringify(getUniqueListBy(books, "title")))
  }, [books])

  const { title, current_page, total_pages, review } = formData

  const handleSubmit:
    | FormEventHandler<HTMLFormElement>
    | MouseEvent<HTMLButtonElement, MouseEvent> = async (e) => {
    e?.preventDefault()
    setLoading(true)

    const formData = new FormData(e?.currentTarget)
    const title = formData.get("title")
    const current_page = formData.get("current_page")
    const total_pages = formData.get("total_pages")
    const review = formData.get("review")

    const bookMatch = books?.find((book) => title === book.title)
    if (bookMatch) {
      setSubmissionError("Book already exists in library!")
      setTimeout(() => setSubmissionError(""), 3000)
      setLoading(false)
      return
    }
    const fbUserId = user?.uid

    await submitBooks()
    setBooks((prevBooksArray) => [
      ...(prevBooksArray as any[]),
      {
        id: Date.now(),
        title: title as string,
        fbUserId: fbUserId as string,
        current_page: parseInt(current_page as string),
        total_pages: parseInt(total_pages as string),
        review: review as string,
        createAt: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
      },
    ])

    setLoading(false)
    closeModal()
  }

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
      <Navbar
        setBooks={setBooks}
        setFilteredBooks={setFilteredBooks}
        books={currentBooks}
        setModalStatus={setModalStatus}
      />
      <Modal
        className="inline-block"
        isOpen={modalStatus}
        ariaHideApp={false}
        onAfterClose={closeModal}>
        <div>
          {/* Main modal */}
          <div
            id="bookModal"
            tabIndex={-1}
            aria-hidden={modalStatus}
            className={`${
              modalStatus ? "block" : "hidden"
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
                    onClick={(e) => setModalStatus((prevStatus) => !prevStatus)}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="bookModal">
                    <svg
                      className="w-3 h-3"
                      aria-hidden={modalStatus}
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
                <form action="" method="POST" onSubmit={handleSubmit}>
                  {/*  Modal body  */}

                  <div className="message-progress">
                    {submissionError && (
                      <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert">
                        <strong className="font-bold m-4">{submissionError}</strong>
                        <span className="absolute top-0 bottom-0 left-0">
                          <svg
                            className="fill-current h-6 w-6 text-red-500"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                          </svg>
                        </span>
                      </div>
                    )}
                    {loading && <div className="circular-progress"></div>}
                  </div>

                  <div className="p-6 space-y-6">
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
                        Total pages
                      </label>
                      <input
                        type="number"
                        placeholder="Current page"
                        name="total_pages"
                        value={total_pages}
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
                  </div>
                  {/* Modal footer  */}
                  <div className="flex justify-center items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button
                      data-modal-hide="bookModal"
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      {loading ? "Submitting..." : "Add"}
                    </button>
                    <button
                      data-modal-hide="bookModal"
                      type="button"
                      onClick={(e) => {
                        closeModal()
                      }}
                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {renderAuthLinks()}
      <div className="absolute top-20">
        <div id="bookDisplay" className="px-4 flex gap-1 justify-center items-center">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 ${loggedIn}`}>
            {filteredBooks.length > 0
              ? filteredBooks.map((book, i) => <Book key={i} book={book} onEdit={onEdit} />)
              : currentBooks.map((book, i) => <Book key={i} book={book} onEdit={onEdit} />)}
          </div>
        </div>
      </div>
      {user && (
        <Paginate
          previousPage={previousPage}
          nextPage={nextPage}
          booksPerPage={booksPerPage}
          totalBooks={books.length}
          paginate={paginate}
        />
      )}
    </>
  )
}
