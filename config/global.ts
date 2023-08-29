import { createClient } from "pexels"
import { createApi } from "unsplash-js"

export const unsplashClient = createApi({
  accessKey: process.env.NEXT_PUBLIC_API_KEY as string,
})

export const apiUrl = process.env.NEXT_PUBLIC_API_URL
