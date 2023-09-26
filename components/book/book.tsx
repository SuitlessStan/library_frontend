import Modal from "react-modal"
import Image from "next/image"
import "./book.css"
import { useState, useRef, FormEventHandler, MouseEventHandler } from "react"
import { Book } from "@/utils/types"
import { useWindowSize } from "usehooks-ts"
import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProgressBar from "@ramonak/react-progress-bar"
import { If, Else, Then } from "react-if"
import moment from "moment"
import Tooltip from "../Tooltip/Tooltip"

let customStyles = {
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "21rem",
    height: "20rem",
    transform: "translate(-50%, -50%)",
    background: "black",
    color: "none",
    padding: "16px",
  },
  overlay: {
    background: "none",
    color: "none",
  },
}

let progressModalStyles = {
  ...customStyles,
  content: {
    ...customStyles.content,
    width: "12rem",
    height: "11rem",
  },
}

let removeBookTitleModalStyle = {
  ...customStyles,
  content: {
    ...customStyles.content,
    width: "11rem",
    height: "6rem",
    padding: "10px",
  },
}

type BookData = {
  book: Book
  onEdit: (id: string | number, params: any[]) => void
  onRemove: (id: string | number) => void
}

const Book: React.FC<BookData> = ({ book, onEdit, onRemove }) => {
  let { id, title, review, author, cover_url, current_page, total_pages, createAt, updatedAt } =
    book

  const size = useWindowSize()

  const [bookReview, setBookReview] = useState(review)
  const [progress, setProgress] = useState(false)
  const [modalIsOpen, setModalOpen] = useState(false)
  const [removeBook, setRemoveBook] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const [pages, setPages] = useState({
    currentPage: current_page,
    totalPages: total_pages,
  })

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const editReviewRef = useRef<HTMLButtonElement | null>(null)
  const removeBookTitleRef = useRef<HTMLButtonElement | null>(null)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const closeProgressModal = () => setProgress(false)

  const toggleProgress = () => setProgress((prevState) => !prevState)

  const toggleContent = () => setShowFullContent((prevState) => !prevState)

  const toggleRemoveBookModal = () => setRemoveBook((prevState) => !prevState)

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

    if (editReviewRef.current) {
      const buttonRect = editReviewRef.current.getBoundingClientRect()

      const remToPixelRatio = parseFloat(getComputedStyle(document.documentElement).fontSize)

      const modalWidthRem = 12
      const modalHeightRem = 10

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

  if (editReviewRef.current) {
    const { left, top, right, bottom } = caclulateModalPosition()
    if (left && top && bottom && right) {
      progressModalStyles.content.top = top
      progressModalStyles.content.left = left
      progressModalStyles.content.bottom = bottom
      progressModalStyles.content.right = right
    }
  }

  if (removeBookTitleRef.current) {
    const { left, top, right, bottom } = caclulateModalPosition()
    if (left && top && bottom && right) {
      removeBookTitleModalStyle.content.top = top
      removeBookTitleModalStyle.content.left = left
      removeBookTitleModalStyle.content.bottom = bottom
      removeBookTitleModalStyle.content.right = right
    }
  }

  const removeBookTitle: MouseEventHandler<HTMLButtonElement> = (e) => {
    const { id: bookID } = book
    if (bookID) onRemove(bookID)
  }

  current_page = current_page ? current_page : 0
  total_pages = total_pages ? total_pages : 1000

  const displayedContent = showFullContent ? review : review?.split("\n").slice(0, 3).join("\n")

  const imageUrl = cover_url ? cover_url[1].large : "/images/book_cover.jpg"

  const handleSubmitReview: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const formattedValue = bookReview
      .split("\n")
      .map((line) => line.replace(/^\s+|\s+$/g, ""))
      .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
      .join("\n")
    setBookReview(formattedValue)

    if (id) onEdit(id, [{ bookReview: formattedValue }])
    closeModal()
  }

  const handleEditProgress: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (pages.currentPage) {
      onEdit(id as string, [{ currentPage: pages.currentPage }])
    }
    if (pages.totalPages) {
      onEdit(id as string, [{ totalPages: pages.totalPages }])
    }
    if (pages.currentPage && pages.totalPages) {
      onEdit(id as string, [{ currentPage: pages.currentPage }, { totalPages: pages.totalPages }])
    }
    setProgress(false)
  }

  return (
    <div className="shadow-lg rounded text-center border-1 border-black bg-tertiary book">
      <Tooltip text="delete book" className="float-right mb-2">
        <button
          ref={removeBookTitleRef}
          className="rounded-3xl hover:bg-primary hover:text-secondary py-1 px-3"
          onClick={toggleRemoveBookModal}>
          <FontAwesomeIcon icon={faX} size="xs" className="inline-block" />
        </button>
      </Tooltip>
      <Modal
        contentLabel="Remove"
        style={removeBookTitleModalStyle as any}
        isOpen={removeBook}
        ariaHideApp={false}
        onRequestClose={toggleRemoveBookModal}>
        <span className="block text-sm">Are you sure you want to remove this book ?</span>
        <div className="flex gap-2 mt-2 justify-center items-center">
          <button
            className="text-xs md:text-md dark:bg-secondary dark:text-primary bg-primary text-secondary hover:bg-tertiary hover:text-secondary py-1 px-2 rounded"
            onClick={removeBookTitle}>
            Remove
          </button>
          <button
            className="text-xs md:text-md dark:bg-secondary dark:text-primary bg-primary text-secondary hover:bg-tertiary hover:text-secondary py-1 px-2 rounded"
            onClick={toggleRemoveBookModal}>
            Cancel
          </button>
        </div>
      </Modal>
      <div className="w-full text-center flex justify-center">
        <Image
          width={200}
          height={200}
          className="book-cover"
          src={imageUrl}
          alt="Sunset in the mountains"
        />
      </div>
      <div className="py-1">
        <h3 className="font-bold text-white text-md md:text-2xl">{title}</h3>
        <span className="inline-block text-white font-bold text-sm">{author}</span>
        <p className="text-sm p-2 h-16 text-left shadow-lg text-white mt-2 text-ellipsis overflow-auto">
          {displayedContent}
          {review?.split("\n").length > 1 && (
            <button onClick={toggleContent} className="cursor-pointer rounded text-primary text-xs">
              <u>{showFullContent ? "See Less" : "See More"}</u>
            </button>
          )}
        </p>
        <span className="inline-block text-xs opacity-80">
          {moment(updatedAt ? updatedAt : createAt).format("DD MMM HH:mm")}
        </span>
        <div className="px-2">
          <div className="flex justify-between text-sm md:text-md text-white py-2">
            <button ref={buttonRef} onClick={openModal}>
              <Tooltip text="edit book review" className="hidden md:block">
                <u className="text-xs md:text-md">Edit review</u>
              </Tooltip>
            </button>
            <button ref={editReviewRef} onClick={toggleProgress}>
              <Tooltip text="edit your current page" className="hidden md:block">
                <u className="text-xs md:text-md">Edit progress</u>
              </Tooltip>
            </button>
          </div>
          <If condition={progress === true}>
            <Then>
              <Modal
                style={progressModalStyles}
                contentLabel="Progress"
                isOpen={progress}
                ariaHideApp={false}
                onRequestClose={closeProgressModal}>
                <div className="progress-section">
                  <label htmlFor="currentPage" className="text-xs">
                    Current page
                    <input
                      type="number"
                      className="w-full p-1 border-none rounded-sm text-black"
                      name="currentPage"
                      placeholder="current page"
                      id="currentPage"
                      value={pages.currentPage as number}
                      onChange={(e) =>
                        setPages({ currentPage: parseInt(e.target.value), totalPages: total_pages })
                      }
                    />
                  </label>
                  <label htmlFor="pagesCount" className="text-xs">
                    Total pages
                    <input
                      type="number"
                      className="w-full p-1 border-none rounded-sm text-black"
                      name="pagesCount"
                      placeholder="total pages"
                      id="pagesCount"
                      value={pages.totalPages as number}
                      onChange={(e) =>
                        setPages({
                          currentPage: current_page,
                          totalPages: parseInt(e.target.value),
                        })
                      }
                    />
                  </label>
                </div>
                <div className="flex gap-2 justify-center mt-5">
                  <button
                    className="text-xs md:text-md dark:bg-secondary dark:text-primary bg-primary text-secondary hover:bg-tertiary hover:text-secondary py-1 px-2 rounded"
                    onClick={handleEditProgress}>
                    Update
                  </button>
                  <button
                    className="text-xs md:text-md dark:bg-secondary dark:text-primary bg-primary text-secondary hover:bg-tertiary hover:text-secondary py-1 px-2 rounded"
                    onClick={(e) => setProgress(false)}>
                    Cancel
                  </button>
                </div>
              </Modal>
            </Then>
            <Else>
              <ProgressBar
                bgColor="#000"
                className="mt-4"
                animateOnRender
                isLabelVisible={true}
                completed={((current_page / total_pages) * 100).toFixed(1)}
              />
            </Else>
          </If>
        </div>
        <Modal
          contentLabel="Review"
          style={customStyles as any}
          isOpen={modalIsOpen}
          ariaHideApp={false}
          onRequestClose={closeModal}>
          <span className="block my-2">Edit your book review</span>
          <form action="" method="post" onSubmit={handleSubmitReview}>
            <textarea
              name="bookReview"
              onChange={handleChange}
              className="p-3 overflow-y-scroll text-black"
              style={{ resize: "none" }}
              rows={8}
              cols={30}
              value={bookReview}></textarea>
            <div className="flex justify-center gap-5">
              <button
                type="submit"
                className="text-xs md:text-md dark:bg-secondary dark:text-primary bg-primary text-secondary hover:bg-tertiary hover:text-secondary  px-3 py-1">
                Save
              </button>
              <button
                data-modal-hide="bookModal"
                type="button"
                onClick={closeModal}
                className="text-xs md:text-md dark:bg-secondary dark:text-primary bg-primary text-secondary hover:bg-tertiary hover:text-secondary  px-3 py-1">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Book
