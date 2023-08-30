export type UnsplashImage = {
  alt_description: string
  blur_hash: string
  breadcrumbs: any[]
  color: string
  created_at: string
  current_user_collections: any[]
  description: string | null
  downloads: number
  exif: {
    make: string
    model: string
    name: string
    exposure_time: string
    aperture: string
  }
  height: number
  id: string
  liked_by_user: boolean
  likes: number
  links: {
    self: string
    html: string
    download: string
    download_location: string
  }
  location: {
    name: string
    city: string
    country: string
    position: {
      latitude: number
      longitude: number
    }
  }
  promoted_at: string
  slug: string
  sponsorship: any | null
  topic_submissions: any
  updated_at: string
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
  views: number
  width: number
}

export type Book = {
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
