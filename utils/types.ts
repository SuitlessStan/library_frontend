export type UnsplashImage = {
  alt_description: string
  description: string | null
  height: number
  id: string
  location: {
    name: string
    city: string
    country: string
    position: {
      latitude: number
      longitude: number
    }
  }
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  user: {
    id: string
    updated_at: string
    username: string
    name: string
    first_name: string
  }
  width: number
}

export type Book = {
  title: string
  id?: string | number
  createAt?: string | Date
  updatedAt?: string | Date
  inactiveAt?: string | Date
  fbUserId: string
  current_page: number | null
  total_pages: number | null | undefined
  author?: string
  cover_url?: {
    medium: string
    large: string
  }
  review: string
}
