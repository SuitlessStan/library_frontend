import Modal from "react-modal"
import Image from "next/image"
import { useState, useEffect } from "react"

type BookProps = {
  author: string
  cover_url: { url: string }[]
  createAt: string
  current_page: number
  fbUserId: string
  finished: number
  id: number
  inactiveAt: null | string
  review: string
  title: string
  total_pages: number
  updatedAt: string
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
}

export default function Book() {
  const [modalIsOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)
  return (
    <div className="max-w-sm rounded overflow shadow-lg text-center">
      <Image
        width={200}
        height={200}
        className="w-full"
        src="https://upload.wikimedia.org/wikipedia/en/4/4b/Crimeandpunishmentcover.png"
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-2xl mb-2">
          Crime and Punishment <span className="inline-block text-sm">Fyodor Dostoevsky</span>
        </div>
        <p className="text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
          Maiores et perferendis eaque, exercitationem praesentium nihil.
          <span>
            <button onClick={openModal}>Open modal</button>
          </span>
          <Modal
            contentLabel="Example Modal"
            style={customStyles}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}>
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </Modal>
        </p>
      </div>
    </div>
  )
}
