import type { NextApiRequest, NextApiResponse } from "next"
import { NextRequest, NextResponse } from "next/server"
import { topTracks } from "@/config/global"

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const response = await topTracks()
  const { items } = await response.json()

  console.log("response from top tracks ", response)

  const tracks = items.slice(0, 5).map((track) => ({
    title: track.name,
    artist: track.artists.map((_artist) => _artist.name).join(", "),
    url: track.external_urls.spotify,
    coverImage: track.album.images[1],
  }))

  return NextResponse.json({ tracks }, { status: 200 })
}
