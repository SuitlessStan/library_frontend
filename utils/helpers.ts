import { Book } from "./types"

export const scrollToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
}

const generateRandomBook = (): Book => {
  const titles = [
    "The Great Gatsby",
    "To Kill a Mockingbird",
    "1984",
    "Pride and Prejudice",
    "Harry Potter",
  ]
  const authors = [
    "F. Scott Fitzgerald",
    "Harper Lee",
    "George Orwell",
    "Jane Austen",
    "J.K. Rowling",
  ]
  const coverUrls = [
    "https://example.com/book1-cover.jpg",
    "https://example.com/book2-cover.jpg",
    "https://example.com/book3-cover.jpg",
    "https://example.com/book4-cover.jpg",
    "https://example.com/book5-cover.jpg",
  ]
  const reviews = [
    "A classic novel",
    "An inspiring story",
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  ]

  const randomIndex = Math.floor(Math.random() * titles.length)

  return {
    title: titles[randomIndex],
    author: authors[randomIndex],
    cover_url: coverUrls[randomIndex],
    review: reviews[randomIndex],
    fbUserId: "your-fb-user-id",
    current_page: Math.floor(Math.random() * 200) + 1,
    total_pages: Math.random() > 0.5 ? Math.floor(Math.random() * 400) + 1 : null,
  }
}

export const generateRandomBooks = (count: number): Book[] => {
  const books: Book[] = []
  for (let i = 0; i < count; i++) {
    books.push(generateRandomBook())
  }
  return books
}
