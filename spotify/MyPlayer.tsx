import { useWebPlaybackSDKReady } from "react-spotify-web-playback-sdk/dist/webPlaybackSDKReady"

const MyPlayer = () => {
  const webPlaybackSDKReady = useWebPlaybackSDKReady()

  if (!webPlaybackSDKReady) return <div>Loading...</div>

  return <div>Spotify App is ready!</div>
}

export default MyPlayer
