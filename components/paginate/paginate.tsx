import React from "react"

const Paginate = ({
  booksPerPage,
  totalBooks,
  paginate,
  previousPage,
  nextPage,
}: {
  booksPerPage: number
  totalBooks: number
  paginate: (pageNumber: number) => void
  previousPage: () => void
  nextPage: () => void
}) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="pagination-container">
      <ul className="pagination flex gap-2">
        <li
          onClick={previousPage}
          className="page-number bg-blue-400 p-1 rounded text-black cursor-pointer">
          Prev
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            onClick={() => paginate(number)}
            className="page-number bg-blue-400 p-1 rounded text-black">
            {number}
          </li>
        ))}
        <li
          onClick={nextPage}
          className="page-number bg-blue-400 p-1 rounded text-black cursor-pointer">
          Next
        </li>
      </ul>
    </div>
  )
}

export default Paginate
