import { useSpotifyPlayer } from "react-spotify-web-playback-sdk/dist/spotifyPlayer"

const PauseResumeButton = () => {
  const player = useSpotifyPlayer()

  if (player === null) return null

  return (
    <div>
      <button onClick={() => player.pause()}>pause</button>
      <button onClick={() => player.resume()}>resume</button>
    </div>
  )
}

export default PauseResumeButton
