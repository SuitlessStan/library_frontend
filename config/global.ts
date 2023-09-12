import { createClient } from "pexels"
import { createApi } from "unsplash-js"

export const unsplashClient = createApi({
  accessKey: process.env.NEXT_PUBLIC_API_KEY as string,
})

export const getAccessToken = async () => {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN as string

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID as string}:${process.env.SPOTIFY_CLIENT_SECRET as string}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to retrieve access token")
  }

  return response.json()
}

export const topTracks = async () => {
  const { access_token } = await getAccessToken()

  return fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export const apiUrl = process.env.NEXT_PUBLIC_API_URL
