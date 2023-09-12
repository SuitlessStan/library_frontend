import { getAccessToken } from "@/config/global"
import { useCallback } from "react"
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk"
import SongTitle from "./SongTitle"

const MySpotifyPlayer: React.VFC = () => {
  const getAuthToken = useCallback(async () => {
    return await getAccessToken()
  }, [])

  return (
    <WebPlaybackSDK
      getOAuthToken={getAuthToken}
      initialDeviceName="Spotify web app"
      initialVolume={0.5}>
      {/* `TogglePlay` and `SongTitle` will be defined later. */}
      {/* <TogglePlay /> */}
      <SongTitle />
    </WebPlaybackSDK>
  )
}

export default MySpotifyPlayer
