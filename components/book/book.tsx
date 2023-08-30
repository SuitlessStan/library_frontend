import Modal from "react-modal"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Book } from "@/utils/types"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    background: "black",
    color: "none",
  },
  overlay: {
    background: "none",
    color: "none",
  },
}

type BookData = {
  book: Book
}

const Book: React.FC<BookData> = ({ book }) => {
  const { title, review, author, cover_url } = book

  const [modalIsOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)
  const [bookReview, setBookReview] = useState(review)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookReview(e.target.value)
  }
  return (
    <div className="max-w-sm rounded overflow shadow-lg text-center">
      <Image
        width={200}
        height={200}
        className="w-full"
        src={"https://upload.wikimedia.org/wikipedia/en/4/4b/Crimeandpunishmentcover.png"}
        alt="Sunset in the mountains"
      />
      <div className="py-2">
        <div className="font-bold text-md md:text-2xl mb-2">
          {title} <br />
          <span className="inline-block text-sm">{author}</span>
        </div>
        <p className="text-sm overflow-y-scroll h-20">{review}</p>
        <span className="px-2 block">
          <button onClick={openModal}>
            <u>Edit review</u>
          </button>
        </span>
        <Modal
          contentLabel="Review"
          style={customStyles}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}>
          <span className="block my-2">Edit your book review</span>
          <textarea
            name="bookReview"
            onChange={handleChange}
            className="p-3 text-black"
            style={{ resize: "none" }}
            rows={8}
            cols={30}
            value={bookReview}></textarea>
          <div className="flex justify-center gap-5">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Save
            </button>
            <button
              data-modal-hide="bookModal"
              type="button"
              onClick={closeModal}
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Book
