import Modal from "react-modal"
import Image from "next/image"
import "./book.css"
import { useState, useRef } from "react"
import { Book } from "@/utils/types"
import { useWindowSize } from "usehooks-ts"
import ProgressBar from "@ramonak/react-progress-bar"
import { If, Else, Then } from "react-if"

let customStyles = {
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "22rem",
    height: "21rem",
    transform: "translate(-50%, -50%)",
    background: "black",
    color: "none",
    padding: "1rem 1.5rem",
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
  let { title, review, author, cover_url, current_page, total_pages } = book

  const [bookReview, setBookReview] = useState(review)
  const [progress, setProgress] = useState(false)

  const [modalIsOpen, setModalOpen] = useState(false)

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const size = useWindowSize()

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const toggleProgress = () => setProgress((prevState) => !prevState)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookReview(e.target.value)
  }

  const caclulateModalPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()

      const remToPixelRatio = parseFloat(getComputedStyle(document.documentElement).fontSize)

      const modalWidthRem = 22
      const modalHeightRem = 21

      const modalWidth = modalWidthRem * remToPixelRatio
      const modalHeight = modalHeightRem * remToPixelRatio

      const modalLeft = buttonRect.left + window.scrollX
      const modalTop = buttonRect.top + window.scrollY

      // Define a margin to ensure the modal stays within the screen boundaries
      const margin = 200

      const adjustedLeft = Math.max(margin, Math.min(modalLeft, size.width - modalWidth - margin))
      const adjustedTop = Math.max(margin, Math.min(modalTop, size.height - modalHeight))

      return {
        left: adjustedLeft,
        top: adjustedTop,
        right: adjustedLeft + modalWidth,
        bottom: adjustedTop + modalHeight,
      }
    }

    return {}
  }

  if (buttonRef.current) {
    const { left, top, right, bottom } = caclulateModalPosition()
    if (left && top && bottom && right) {
      customStyles.content.top = top
      customStyles.content.left = left
      customStyles.content.bottom = bottom
      customStyles.content.right = right
    }
  }

  current_page = current_page ? current_page : 0
  total_pages = total_pages ? total_pages : 1000

  const imageUrl = cover_url
    ? cover_url.medium
    : "https://upload.wikimedia.org/wikipedia/en/4/4b/Crimeandpunishmentcover.png"

  return (
    <div className="max-w-sm overflow shadow-lg text-center p-2 border-2 border-t-0 border-black dark:border-white">
      <Image
        width={200}
        height={200}
        className="w-full"
        src={imageUrl}
        alt="Sunset in the mountains"
      />
      <div className="py-2">
        <div className="font-bold text-md md:text-2xl mb-2">
          {title} <br />
          <span className="inline-block text-sm">{author}</span>
        </div>
        <p className="text-sm h-20">{review}</p>
        <span className="px-2 block">
          <div className="flex justify-between text-sm md:text-md">
            <button ref={buttonRef} onClick={openModal}>
              <u>Edit review</u>
            </button>
            <button onClick={toggleProgress}>
              <u>Edit progress</u>
            </button>
          </div>
          <If condition={progress === true}>
            <Then>
              <div className="progress-section">
                <input
                  type="number"
                  className="w-full p-1 border-none rounded-sm text-black"
                  name="current_page"
                  defaultValue={current_page}
                  id="current_page"
                />
                <input
                  type="number"
                  className="w-full p-1 border-none rounded-sm text-black"
                  name="pages_count"
                  defaultValue={total_pages}
                  id="pages_count"
                />
              </div>
            </Then>
            <Else>
              <ProgressBar
                bgColor="#1d4ed8"
                className="my-2"
                animateOnRender
                isLabelVisible={false}
                completed={(current_page / total_pages) * 100}
              />
            </Else>
          </If>
        </span>
        <Modal
          contentLabel="Review"
          style={customStyles as any}
          isOpen={modalIsOpen}
          ariaHideApp={false}
          onRequestClose={closeModal}>
          <span className="block my-2">Edit your book review</span>
          <form action="/api/review" method="post">
            <textarea
              name="bookReview"
              onChange={handleChange}
              className="p-3 overflow-y-scroll text-black"
              style={{ resize: "none" }}
              rows={8}
              cols={30}
              value={bookReview}></textarea>
          </form>
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
