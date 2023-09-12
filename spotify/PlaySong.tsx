import { getAccessToken } from "@/config/global"
import { usePlayerDevice } from "react-spotify-web-playback-sdk/dist/device"

const SPOTIFY_URI = "spotify:track:4Zts9erRexAxILn5XjSwUN"
const PlaySong = () => {
  const device = usePlayerDevice()

  const playSong = async () => {
    const access_token = await getAccessToken()
    if (device === null) return

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [SPOTIFY_URI] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
  }

  if (device === null) return null

  return <button onClick={playSong}>Play Song</button>
}
